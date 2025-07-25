import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { rabbitMQService } from "../../../libs/communicator/rabbitMQService";

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Serve the API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/about", (req, res) => {
  res.send("This is the User Service API for Voltrico.");
});

// --- App Initialization ---
const initApp = async (): Promise<Express> => {
  if (!process.env.DB_CONNECTION) {
    throw new Error("DB_CONNECTION is not defined");
  }
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to MongoDB");
    await rabbitMQService.init();
    console.log("Connected to RabbitMQ");
    return app;
  } catch (err) {
    console.error("Failed to connect to MongoDB or RabbitMQ:", err);
    throw err;
  }
};

export default initApp;