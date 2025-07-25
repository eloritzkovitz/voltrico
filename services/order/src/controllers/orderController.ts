import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../server";
import { Order } from "../models/Order";
import { rabbitMQService } from "../../../../libs/communicator/rabbitMQService";

// Create a new order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, itemId } = req.body;
    if (!customerId || !itemId) {
      res.status(400).json({ message: "Customer ID and Item ID are required" });
      return;
    }
    const orderRepo = AppDataSource.getRepository(Order);
    const order = orderRepo.create({
      orderId: uuidv4(),
      customerId,
      itemId,
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

// Get all orders with customer and item details
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find();

    // Fetch customer and item details
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        let customer = null;
        let item = null;

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
          const itemRes = await axios.get(
            `http://item-service/api/items/${order.itemId}`
          );
          item = itemRes.data;
        } catch (err) {
          item = { id: order.itemId, error: "Could not fetch item" };
        }

        return {
          id: order.id,
          orderId: order.orderId,
          customer,
          item,
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
