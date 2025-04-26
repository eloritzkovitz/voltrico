import { Request, Response } from "express";
import Order from "../models/Order";
import Customer from "../models/User";
import Item from "../models/Item";
import { v4 as uuidv4 } from "uuid";

// Controller function for creating a new order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, itemId } = req.body;

    // Validate input data
    if (!customerId || !itemId) {
      res.status(400).json({ message: "Customer ID and Item ID are required" });
      return;
    }

    // Generate a unique orderId using UUID
    const orderId = uuidv4();

    // Create a new order instance
    const order = new Order({
      orderId,
      customerId,
      itemId,
    });

    // Save the order to the database
    await order.save();

    // Update the orders array of the associated customer
    await Customer.findByIdAndUpdate(customerId, { $push: { orders: order._id } });

    // Update the orders array of the associated item
    await Item.findByIdAndUpdate(itemId, { $push: { orders: order._id } });

    // Respond with the created order object
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all orders
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createOrder,
  getAllOrders,
};