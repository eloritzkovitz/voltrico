import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "./User";
import { isAuthorized, userResponse } from "../../utils/userUtils";
import { getUserId, handleError, logger } from "@eloritzkovitz/server-essentials";

// Get user data
const getUserData = async (req: Request, res: Response): Promise<void> => {
  logger.info("Get user data attempt for userId: %s", getUserId(req));
  try {
    const userId = getUserId(req);

    const user = await userModel.findById(userId).select("-password");
    if (!user) {      
      handleError(res, `User not found for userId: ${userId}`, undefined, 404);
      return;
    }

    logger.info("User data fetched for userId: %s", userId);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error fetching user data for userId: ${getUserId(req)}`, error);
  }
};

// Update user data
const updateUser = async (req: Request & { user?: { _id: string; role: string } }, res: Response): Promise<void> => {
  logger.info("Update user attempt for userId: %s by user: %s", req.params.id, req.user?._id);
  try {
    const userId = req.params.id;

    // Ensure the authenticated user is the same as the user being updated or is an administrator
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized update attempt by user: ${req.user?._id} for userId: ${userId}`, undefined, 403);      
      return;
    }

    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for update, userId: ${userId}`, undefined, 404);
      return;
    }

    // Update user details
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      logger.info("Password updated for userId: %s", userId);
    }    

    // Save the updated user data
    await user.save();

    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error updating user data for userId: ${req.params.id}`, error);
  }
};

// Delete user data
const deleteUser = async (req: Request & { user?: { _id: string; role: string } }, res: Response): Promise<void> => {
  logger.info("Delete user attempt for userId: %s by user: %s", req.params.id, req.user?._id);
  try {
    const userId = req.params.id;

    // Ensure the authenticated user is the same as the user being deleted or is an administrator
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized delete attempt by user: ${req.user?._id} for userId: ${userId}`, undefined, 403);
      return;
    }

    const user = await userModel.findById(userId);

    if (!user) {
      handleError(res, `User not found for deletion, userId: ${userId}`, undefined, 404);
      return;
    }    

    // Delete the user from the database
    await userModel.findByIdAndDelete(userId);

    logger.info("User deleted successfully, userId: %s", userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, `Error deleting user for userId: ${req.params.id}`, error);
  }
};

export default {  
  getUserData,  
  updateUser,
  deleteUser,  
};
