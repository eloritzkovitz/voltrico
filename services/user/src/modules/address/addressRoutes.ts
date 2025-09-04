import express from "express";
import { addAddress, updateAddress, deleteAddress } from "./addressController";
import { authenticate } from "@eloritzkovitz/server-essentials";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: API for managing user addresses
 */

/**
 * @swagger
 * /api/users/:id/addresses:
 *   post:
 *     summary: Add address to user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address added
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/:id/addresses", authenticate, addAddress);

/**
 * @swagger
 * /api/users/:id/addresses/:addressIndex:
 *   put:
 *     summary: Update address for user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put("/:id/addresses/:addressIndex", authenticate, updateAddress);

/**
 * @swagger
 * /api/users/:id/addresses/:addressIndex:
 *   delete:
 *     summary: Delete address for user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete("/:id/addresses/:addressIndex", authenticate, deleteAddress);

export default router;
