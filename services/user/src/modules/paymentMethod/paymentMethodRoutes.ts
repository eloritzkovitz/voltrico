import express from "express";
import { addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "./paymentMethodController";
import { authenticate } from "@eloritzkovitz/server-essentials";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PaymentMethods
 *   description: API for managing user payment methods
 */

/**
 * @swagger
 * /api/users/:id/payment-methods:
 *   post:
 *     summary: Add payment method to user
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       200:
 *         description: Payment method added
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/:id/payment-methods", authenticate, addPaymentMethod);

/**
 * @swagger
 * /api/users/:id/payment-methods/:paymentIndex:
 *   put:
 *     summary: Update payment method for user
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       200:
 *         description: Payment method updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Server error
 */
router.put("/:id/payment-methods/:paymentIndex", authenticate, updatePaymentMethod);

/**
 * @swagger
 * /api/users/:id/payment-methods/:paymentIndex:
 *   delete:
 *     summary: Delete payment method for user
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment method deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Server error
 */
router.delete("/:id/payment-methods/:paymentIndex", authenticate, deletePaymentMethod);

export default router;
