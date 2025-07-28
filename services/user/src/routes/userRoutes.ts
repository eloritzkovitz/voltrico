import express from "express";
import usersController from "../controllers/userController";
import { authenticate } from "voltrico-libs";
import { upload } from "voltrico-libs";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user data
 *     description: Retrieve the authenticated user's data.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authenticate, usersController.getUserData);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user data
 *     description: Update the authenticated user's details including first name, last name, password, and profile picture.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put(
  "/me",
  authenticate,
  upload.single("profilePicture"),
  usersController.updateUser
);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete current user
 *     description: Delete the authenticated user's account, including their profile picture and associated data.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/me", authenticate, usersController.deleteUser);

export default router;
