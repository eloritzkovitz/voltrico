import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DataSource } from "typeorm";
import { Order } from "./models/Order";
import orderRoutes from "./routes/orderRoutes";
import { rabbitMQService } from "@eloritzkovitz/server-essentials";

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Serve the API routes
app.use("/orders", orderRoutes);

app.get("/about", (req, res) => {
  res.send("This is the Order Service API for Voltrico.");
});

// --- App Initialization ---
const initApp = async (): Promise<Express> => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");
    await rabbitMQService.init();
    console.log("Connected to RabbitMQ");
    return app;
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    throw err;
  }
};

export { AppDataSource };
export default initApp;