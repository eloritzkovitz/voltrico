import express from "express";
import searchRoutes from "./routes/searchRoutes";
import { rabbitMQService } from "@eloritzkovitz/server-essentials";
import { listenForProductEvents } from "./events/productEventListener";
import { listenForOrderEvents } from "./events/orderEventListener";

const app = express();
app.use(express.json());

// Serve the API Routes
app.use("/search", searchRoutes);

// --- App Initialization ---
export default async function initApp() {
  try {    
    await rabbitMQService.init();
    console.log("Connected to RabbitMQ");

    // Call event listeners after successful RabbitMQ connection
    await listenForProductEvents();
    await listenForOrderEvents();

    return app;
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    throw err;
  }
}