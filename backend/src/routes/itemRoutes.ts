import express from "express";
import multer from "multer";
import itemController from "../controllers/itemController";
import { authMiddleware, checkAdminRole } from "../middleware/auth";

const upload = multer().none();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API for managing items
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/", itemController.getAllItems);

/**
 * @swagger
 * /items/search:
 *   get:
 *     summary: Search items by query
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/search", itemController.getItemsByQuery);

/**
 * @swagger
 * /items/category:
 *   get:
 *     summary: Get items by category
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of items in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/category", itemController.getItemsByCategory);

/**
 * @swagger
 * /items/criteria:
 *   get:
 *     summary: Get items by criteria
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by color
 *       - in: query
 *         name: madeIn
 *         schema:
 *           type: string
 *         description: Filter by country of origin
 *       - in: query
 *         name: weight
 *         schema:
 *           type: string
 *         description: Filter by weight
 *     responses:
 *       200:
 *         description: List of items matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/criteria", itemController.getItemsByCriteria);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
router.get("/:id", itemController.getItemById);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware, checkAdminRole, upload, itemController.createItem);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put("/:id", authMiddleware, checkAdminRole, upload, itemController.updateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete("/:id", authMiddleware, checkAdminRole, itemController.deleteItem);

export default router;