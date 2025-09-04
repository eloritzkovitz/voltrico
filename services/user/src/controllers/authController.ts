import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/User";
import { userResponse } from "../utils/userUtils";
import {
  handleError,
  logger,
  generateToken,
  verifyRefreshToken,
} from "@eloritzkovitz/server-essentials";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google sign-in
const googleSignIn = async (req: Request, res: Response) => {
  logger.info("Google sign-in attempt");
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      handleError(res, "Invalid Google ID token received", undefined, 400);
      return;
    }

    const { sub, email, given_name, family_name, picture } = payload;
    logger.info("Google payload received for email: %s", email);

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: sub, // Use Google sub as a placeholder password        
        joinDate: new Date().toISOString(),
      });
    } else {
      logger.info("User found for email %s", email);
    }

    // Generate tokens
    const tokens = generateToken(user._id, user.role);
    if (!tokens) {
      handleError(res, `Token generation failed for user: ${email}`, undefined, 500);
      return;
    }

    // Save refresh token
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    logger.info("Google sign-in successful for user %s", email);
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    handleError(res, "Google sign-in error", err, 400);
    return;
  }
};

// Register function
const register = async (req: Request, res: Response) => {
  logger.info("Register attempt for email: %s", req.body.email);
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);    
    const user = await userModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,      
      joinDate: new Date().toISOString(),
    });

    logger.info("User registered successfully: %s", user.email);
    res.status(201).json(userResponse(user));
  } catch (err) {
    handleError(res, "User registration error", err, 400);
  }
};

// Login function
const login = async (req: Request, res: Response) => {
  logger.info("Login attempt for email: %s", req.body.email);
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      handleError(res, `Login failed: User not found for email ${req.body.email}`, undefined, 400);
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      handleError(res, `Login failed: Invalid password for email ${req.body.email}`, undefined, 400);
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      handleError(res, "Server Error", undefined, 500);
      return;
    }

    // generate token
    const tokens = generateToken(user._id, user.role);
    if (!tokens) {
      handleError(res, `Login failed: Token generation error for user ${user.email}`, undefined, 500);
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    logger.info("Login successful for user %s", user.email);
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    handleError(res, "Login error", err, 400);
  }
};

// Logout function
const logout = async (req: Request, res: Response) => {
  logger.info("Logout attempt");

  const { refreshToken } = req.body;
  if (!refreshToken) {
    handleError(res, "Logout failed: Refresh token missing", undefined, 400);
    return;
  }

  try {
    const user = await verifyRefreshToken(refreshToken, userModel);
    await user.save();
    logger.info("Logout successful for user %s", user.email);
    res.status(200).send("success");
  } catch (err) {
    handleError(res, "Logout error", err, 400);
  }
};

// Refresh function
const refresh = async (req: Request, res: Response) => {
  logger.info("Token refresh attempt");
  try {
    const user = await verifyRefreshToken(req.body.refreshToken, userModel);
    if (!user) {
      handleError(res, "Token refresh failed: Invalid user", undefined, 400);
      return;
    }
    const tokens = generateToken(user._id, user.role);

    if (!tokens) {
      handleError(res, `Token refresh failed: Token generation error for user ${user.email}`, undefined, 500);      
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    logger.info("Token refresh successful for user %s", user.email);
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    handleError(res, "Token refresh error", err, 400);
  }
};

export default {
  googleSignIn,
  register,  
  login,  
  logout,
  refresh,
};
