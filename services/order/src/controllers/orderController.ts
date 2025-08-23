import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../server";
import { Order } from "../models/Order";
import { rabbitMQService } from "@eloritzkovitz/voltrico-libs";

// Create a new order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, productId } = req.body;
    if (!customerId || !productId) {
      res.status(400).json({ message: "Customer ID and Product ID are required" });
      return;
    }
    const orderRepo = AppDataSource.getRepository(Order);
    const order = orderRepo.create({
      orderId: uuidv4(),
      customerId,
      productId,
      date: new Date(),
    });
    await orderRepo.save(order);

    // Notify the customer via RabbitMQ
    await rabbitMQService.notifyReceiver(
      customerId,
      "Your order has been placed!",
      "noreply@voltrico.com",
      "Voltrico"
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders with customer and product details
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find();

    // Fetch customer and product details
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        let customer = null;
        let product = null;

        try {
          const customerRes = await axios.get(
            `http://user-service/api/users/${order.customerId}`
          );
          customer = customerRes.data;
        } catch (err) {
          customer = {
            id: order.customerId,
            error: "Could not fetch customer",
          };
        }

        try {
          const productRes = await axios.get(
            `http://product-service/api/products/${order.productId}`
          );
          product = productRes.data;
        } catch (err) {
          product = { id: order.productId, error: "Could not fetch product" };
        }

        return {
          id: order.id,
          orderId: order.orderId,
          customer,
          product,
          date: order.date,
        };
      })
    );

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
