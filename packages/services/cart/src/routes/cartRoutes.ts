import express from "express";
import { optionalAuthenticate } from "@eloritzkovitz/server-essentials";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing user carts
 */

/**
 * @swagger
 * /cart/:id:
 *   get:
 *     summary: Get cart by user or session ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.get("/:id", optionalAuthenticate, getCart);

/**
 * @swagger
 * /cart/:id/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.post("/:id/items", optionalAuthenticate, addCartItem);

/**
 * @swagger
 * /cart/:id/items/:itemIndex:
 *   put:
 *     summary: Update item in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.put("/:id/items/:itemIndex", optionalAuthenticate, updateCartItem);

/**
 * @swagger
 * /cart/:id/items/:itemIndex:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.delete("/:id/items/:itemIndex", optionalAuthenticate, removeCartItem);

/**
 * @swagger
 * /cart/:id/clear:
 *   post:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.post("/:id/clear", optionalAuthenticate, clearCart);

export default router;
