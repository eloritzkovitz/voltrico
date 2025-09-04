import { Request, Response } from "express";
import Cart from "../models/Cart";
import { logger, handleError } from "@eloritzkovitz/server-essentials";

// Get cart by userId or sessionId
export const getCart = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const cart = await Cart.findOne({ $or: [{ userId: id }, { sessionId: id }] });
    if (!cart) {
      handleError(res, `Cart not found for id: ${id}`, undefined, 404);
      return;
    }
    res.status(200).json(cart);
  } catch (error) {
    handleError(res, `Error fetching cart for id: ${id}`, error);
  }
};

// Add item to cart
export const addCartItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    let cart = await Cart.findOne({ $or: [{ userId: id }, { sessionId: id }] });
    if (!cart) {
      cart = new Cart({ userId: req.body.userId, sessionId: req.body.sessionId, items: [] });
    }
    if (!Array.isArray(cart.items)) cart.items = [];
    cart.items.push(req.body);
    await cart.save();
    logger.info("Item added to cart for id: %s", id);
    res.status(200).json(cart);
  } catch (error) {
    handleError(res, `Error adding item to cart for id: ${id}`, error);
  }
};

// Update item in cart
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const itemIndex = Number(req.params.itemIndex);
  try {
    const cart = await Cart.findOne({ $or: [{ userId: id }, { sessionId: id }] });
    if (!cart) {
      handleError(res, `Cart not found for update, id: ${id}`, undefined, 404);
      return;
    }
    if (!Array.isArray(cart.items)) cart.items = [];
    if (!cart.items[itemIndex]) {
      handleError(res, `Item not found for update, id: ${id}, itemIndex: ${itemIndex}`, undefined, 404);
      return;
    }
    cart.items[itemIndex] = { ...cart.items[itemIndex], ...req.body };
    await cart.save();
    logger.info("Item updated in cart for id: %s, itemIndex: %d", id, itemIndex);
    res.status(200).json(cart);
  } catch (error) {
    handleError(res, `Error updating item in cart for id: ${id}`, error);
  }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const itemIndex = Number(req.params.itemIndex);
  try {
    const cart = await Cart.findOne({ $or: [{ userId: id }, { sessionId: id }] });
    if (!cart) {
      handleError(res, `Cart not found for removal, id: ${id}`, undefined, 404);
      return;
    }
    if (!Array.isArray(cart.items)) cart.items = [];
    if (!cart.items[itemIndex]) {
      handleError(res, `Item not found for removal, id: ${id}, itemIndex: ${itemIndex}`, undefined, 404);
      return;
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    logger.info("Item removed from cart for id: %s, itemIndex: %d", id, itemIndex);
    res.status(200).json(cart);
  } catch (error) {
    handleError(res, `Error removing item from cart for id: ${id}`, error);
  }
};

// Clear all items from cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const cart = await Cart.findOne({ $or: [{ userId: id }, { sessionId: id }] });
    if (!cart) {
      handleError(res, `Cart not found for clearing, id: ${id}`, undefined, 404);
      return;
    }
    cart.items = [];
    await cart.save();
    logger.info("Cart cleared for id: %s", id);
    res.status(200).json(cart);
  } catch (error) {
    handleError(res, `Error clearing cart for id: ${id}`, error);
  }
};

// Export all controllers as default
export default {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
};
