import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServerRouter, httpLogger, logger, rabbitMQService } from "@eloritzkovitz/server-essentials";
import authRoutes from "./modules/auth/authRoutes.js";
import userRoutes from "./modules/user/userRoutes.js";
import addressRoutes from "./modules/address/addressRoutes.js";
import paymentMethodRoutes from "./modules/paymentMethod/paymentMethodRoutes.js";

const app = express();

dotenv.config();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Serve API routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/users", addressRoutes);
app.use("/users", paymentMethodRoutes);

// Serve info/health routes
app.use("/", createServerRouter(() => mongoose.connection.readyState === 1 ? "up" : "down"));

app.get("/about", (req, res) => {
  res.send("This is the User Service API for Voltrico.");
});

// Initialize application
const initApp = async (): Promise<Express> => {
  if (!process.env.DB_CONNECTION) {
    throw new Error("DB_CONNECTION is not defined");
  }
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    logger.info("Connected to MongoDB");
    await rabbitMQService.init();
    logger.info("Connected to RabbitMQ");
    return app;
  } catch (err) {
    logger.error("Failed to connect to MongoDB or RabbitMQ: %o", err);
    throw err;
  }
};

export default initApp;