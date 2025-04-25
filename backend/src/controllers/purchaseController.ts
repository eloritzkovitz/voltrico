import { Request, Response } from "express";
import Purchase from "../models/Purchase";
import Customer from "../models/User";
import Item from "../models/Item";
import { v4 as uuidv4 } from "uuid";

// Controller function for creating a new purchase
const createPurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, itemId } = req.body;

    // Validate input data
    if (!customerId || !itemId) {
      res.status(400).json({ message: "Customer ID and Item ID are required" });
      return;
    }

    // Generate a unique purchaseId using UUID
    const purchaseId = uuidv4();

    // Create a new purchase instance
    const purchase = new Purchase({
      purchaseId,
      customerId,
      itemId,
    });

    // Save the purchase to the database
    await purchase.save();

    // Update the purchases array of the associated customer
    await Customer.findByIdAndUpdate(customerId, { $push: { purchases: purchase._id } });

    // Update the purchases array of the associated item
    await Item.findByIdAndUpdate(itemId, { $push: { purchases: purchase._id } });

    // Respond with the created purchase object
    res.status(201).json(purchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all purchases
const getAllPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all purchases from the database
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createPurchase,
  getAllPurchases,
};