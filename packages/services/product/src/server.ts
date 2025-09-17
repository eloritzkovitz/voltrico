import fs from "fs";
import path from "path";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServerRouter, httpLogger, logger, rabbitMQService } from "@eloritzkovitz/server-essentials";
import productRoutes from "./routes/productRoutes.js";

const app = express();

dotenv.config();

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(uploadDir));

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Serve the API routes
app.use("/products", productRoutes);

// Serve info/health routes
app.use("/", createServerRouter(() => mongoose.connection.readyState === 1 ? "up" : "down"));

app.get("/about", (req, res) => {
  res.send("This is the Product Service API for Voltrico.");
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