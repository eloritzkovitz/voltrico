import { Request, Response } from "express";
import userModel from "../user/User";
import { isAuthorized, userResponse } from "../../utils/userUtils";
import { getUserId, handleError, logger } from "@eloritzkovitz/server-essentials";

// Add payment method
export const addPaymentMethod = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  logger.info("Add payment method attempt for userId: %s", userId);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized payment method add attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }

    // Ensure user exists and paymentMethods is initialized
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for payment method add, userId: ${userId}`, undefined, 404);
      return;
    }

    if (!Array.isArray(user.paymentMethods)) user.paymentMethods = [];
    user.paymentMethods.push(req.body);

    await user.save();

    logger.info("Payment method added for userId: %s", userId);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error adding payment method for userId: ${userId}`, error);
  }
};

// Update payment method
export const updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const paymentIndex = Number(req.params.paymentIndex);
  logger.info("Update payment method attempt for userId: %s, paymentIndex: %d", userId, paymentIndex);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized payment method update attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }

    // Ensure user exists and paymentMethods is initialized
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for payment method update, userId: ${userId}`, undefined, 404);
      return;
    }

    if (!Array.isArray(user.paymentMethods)) user.paymentMethods = [];
    if (!user.paymentMethods[paymentIndex]) {
      handleError(res, `Payment method not found for update, userId: ${userId}, paymentIndex: ${paymentIndex}`, undefined, 404);
      return;
    }

    user.paymentMethods[paymentIndex] = { ...user.paymentMethods[paymentIndex], ...req.body };

    await user.save();

    logger.info("Payment method updated for userId: %s, paymentIndex: %d", userId, paymentIndex);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error updating payment method for userId: ${userId}`, error);
  }
};

// Delete payment method
export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const paymentIndex = Number(req.params.paymentIndex);
  logger.info("Delete payment method attempt for userId: %s, paymentIndex: %d", userId, paymentIndex);
  try {
    // Authorization check
    if (!isAuthorized(req, userId)) {
      handleError(res, `Unauthorized payment method delete attempt by user: ${getUserId(req)} for userId: ${userId}`, undefined, 403);
      return;
    }

    // Ensure user exists and paymentMethods is initialized
    const user = await userModel.findById(userId);
    if (!user) {
      handleError(res, `User not found for payment method deletion, userId: ${userId}`, undefined, 404);
      return;
    }

    if (!Array.isArray(user.paymentMethods)) user.paymentMethods = [];
    if (!user.paymentMethods[paymentIndex]) {
      handleError(res, `Payment method not found for deletion, userId: ${userId}, paymentIndex: ${paymentIndex}`, undefined, 404);
      return;
    }

    user.paymentMethods.splice(paymentIndex, 1);

    await user.save();

    logger.info("Payment method deleted for userId: %s, paymentIndex: %d", userId, paymentIndex);
    res.status(200).json(userResponse(user));
  } catch (error) {
    handleError(res, `Error deleting payment method for userId: ${userId}`, error);
  }
};
