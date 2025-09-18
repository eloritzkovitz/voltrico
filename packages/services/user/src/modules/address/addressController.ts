import { Request, Response } from "express";
import { getUserId, handleError, logger } from "@eloritzkovitz/server-essentials";
import userModel from "../user/User.js";
import { isAuthorized, userResponse } from "../../utils/userUtils.js";

// Add address to user
export const addAddress = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  logger.info("Add address attempt for userId: %s", userId);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized address add attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }
    
    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for address add, userId: ${userId}`, undefined, 404);
      return;
    }
    
    // Ensure addresses is always an array
    if (!Array.isArray(user.addresses)) user.addresses = [];
    user.addresses.push(req.body);
    
    await user.save();
    
    logger.info("Address added for userId: %s", userId);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error adding address for userId: ${userId}`, error);
  }
};

// Update address
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const addressIndex = Number(req.params.addressIndex);
  logger.info("Update address attempt for userId: %s, addressIndex: %d", userId, addressIndex);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized address update attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }
    
    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for address update, userId: ${userId}`, undefined, 404);
      return;
    }

    // Ensure addresses is always an array
    if (!Array.isArray(user.addresses)) user.addresses = [];
    if (!user.addresses[addressIndex]) {
      handleError(res, `Address not found for update, userId: ${userId}, addressIndex: ${addressIndex}`, undefined, 404);
      return;
    }

    // Update address
    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
    await user.save();
    logger.info("Address updated for userId: %s, addressIndex: %d", userId, addressIndex);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error updating address for userId: ${userId}`, error);
  }
};

// Delete address
export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const addressIndex = Number(req.params.addressIndex);
  logger.info("Delete address attempt for userId: %s, addressIndex: %d", userId, addressIndex);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized address delete attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for address deletion, userId: ${userId}`, undefined, 404);
      return;
    }
 
    // Ensure addresses is always an array
    if (!Array.isArray(user.addresses)) user.addresses = [];
    if (!user.addresses[addressIndex]) {
      handleError(res, `Address not found for deletion, userId: ${userId}, addressIndex: ${addressIndex}`, undefined, 404);
      return;
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();
    
    logger.info("Address deleted for userId: %s, addressIndex: %d", userId, addressIndex);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error deleting address for userId: ${userId}`, error);
  }
};
