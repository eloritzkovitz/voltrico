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
      date: new Date(),
    });

    // Save the order to the database
    await order.save();

    // Update the orders array of the associated customer
    await Customer.findByIdAndUpdate(customerId, { $push: { orders: order._id } });

    // Update the orders array of the associated item
    await Item.findByIdAndUpdate(itemId, { $push: { orders: order._id } });

    // Fetch the related customer and item details
    const customer = await Customer.findById(customerId).select("name email");
    const item = await Item.findById(itemId).select("name description price image");

    // Respond with the created order and related details
    res.status(201).json({
      id: order._id,
      orderId: order.orderId,
      customer: customer || null,
      item: item || null,
      date: order.date,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all orders
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all orders from the database and populate related fields
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("itemId", "name description price image");

    // Format the response to include necessary details
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      customer: order.customerId, 
      item: order.itemId, 
      date: order.date,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createOrder,
  getAllOrders,
};