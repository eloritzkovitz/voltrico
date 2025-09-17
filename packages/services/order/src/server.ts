import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { createServerRouter, httpLogger, logger, rabbitMQService } from "@eloritzkovitz/server-essentials";
import { Order } from "./models/Order.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

dotenv.config();

// Define the PostgreSQL data source
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Order],
  synchronize: true,
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Serve the API routes
app.use("/orders", orderRoutes);

// Serve info/health routes
app.use("/", createServerRouter(() => AppDataSource.isInitialized ? "up" : "down"));

app.get("/about", (req, res) => {
  res.send("This is the Order Service API for Voltrico.");
});

// Initialize application
const initApp = async (): Promise<Express> => {
  try {
    await AppDataSource.initialize();
    logger.info("Connected to PostgreSQL");
    await rabbitMQService.init();
    logger.info("Connected to RabbitMQ");
    return app;
  } catch (err) {
    logger.error("Failed to connect to PostgreSQL or RabbitMQ: %o", err);
    throw err;
  }
};

export { AppDataSource };
export default initApp;