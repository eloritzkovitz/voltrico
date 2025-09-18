import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleError, logger, rabbitMQService } from "@eloritzkovitz/server-essentials";
import { AppDataSource } from "../server.js";
import { Order } from "../models/Order.js";

// Create a new order
const createOrder = async (req: Request, res: Response): Promise<void> => {  
  try {
    const { customerId, productId } = req.body;
    logger.info("Create order request", { customerId, productId });

    if (!customerId || !productId) {
      handleError(res, "customerId and productId are required", undefined, 400);
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
    await rabbitMQService.publishNotification(
      "notifications",
      {
        receiverId: customerId,
        message: "Your order has been placed!",
        from: "noreply@voltrico.com",
        sender: "Voltrico",
        orderId: order.orderId,
        date: order.date
      }
    );

    logger.info("Order created and notification sent", { orderId: order.orderId });
    res.status(201).json(order);
  } catch (error) {
    handleError(res, "Error creating order", error);
  }
};

// Get all orders with customer and product details
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("Get all orders request");
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
          handleError(res, "Error fetching product details", err);
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

    logger.info("Fetched all orders", { count: formattedOrders.length });
    res.json(formattedOrders);
  } catch (error) {
    handleError(res, "Error fetching orders", error);
  }
};

export default {
  createOrder,
  getAllOrders,
};
