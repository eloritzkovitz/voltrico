import express from "express";
import purchaseController from "../controllers/purchaseController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: API for managing purchases
 */

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: Create a new purchase
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchaseId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               itemId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Purchase created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", purchaseController.createPurchase);

/**
 * @swagger
 * /purchases:
 *   get:
 *     summary: Get all purchases
 *     tags: [Purchases]
 *     responses:
 *       200:
 *         description: List of all purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   purchaseId:
 *                     type: string
 *                   customerId:
 *                     type: string
 *                   itemId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get("/", purchaseController.getAllPurchases);

export default router;