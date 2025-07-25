import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/User";
import { generateToken, verifyRefreshToken } from "../../../../libs/utils/tokenService";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google sign-in
const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).send("Invalid Google ID token");
      return;
    }

    const { sub, email, given_name, family_name, picture } = payload;
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: sub, // Use Google sub as a placeholder password
        profilePicture: picture,
        joinDate: new Date().toISOString(),
      });
    }

    const tokens = generateToken(user._id, user.role);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

// Register function
const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePicture = "";
    const user = await userModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      profilePicture,
      joinDate: new Date().toISOString(),
    });

    await user.save();

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Login function
const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("Wrong username or password");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).send("Wrong username or password");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    // generate token
    const tokens = generateToken(user._id, user.role);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Logout function
const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const user = await verifyRefreshToken(refreshToken, userModel);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

// Refresh function
const refresh = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken, userModel);
    if (!user) {
      res.status(400).send("fail");
      return;
    }
    const tokens = generateToken(user._id, user.role);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  register,
  googleSignIn,
  login,  
  refresh,
  logout,
};
