import express from "express";
import cors from "cors";
import { createServerRouter, httpLogger, rabbitMQService } from "@eloritzkovitz/server-essentials";
import { elasticClient } from "./elastic/elasticClient.js";
import { listenForProductEvents } from "./events/productEventListener.js";
import { listenForOrderEvents } from "./events/orderEventListener.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();
app.use(express.json());

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Serve API Routes
app.use("/search", searchRoutes);

// Serve info/health routes
app.use(
  "/",
  createServerRouter(() => {
    let status = "down";
    elasticClient
      .ping()
      .then(() => {
        status = "up";
      })
      .catch(() => {
        status = "down";
      });
    return status;
  })
);

app.get("/about", (req, res) => {
  res.send("This is the Search Service API for Voltrico.");
});

// Initialize application
export default async function initApp() {
  try { 
    // Ensure connection to Elasticsearch
    await elasticClient.ping();
    console.log("Connected to Elasticsearch");   
    
    // Connect to RabbitMQ
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