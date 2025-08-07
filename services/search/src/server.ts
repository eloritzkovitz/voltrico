import express from "express";
import searchRoutes from "./routes/searchRoutes";
import { listenForProductEvents } from "./events/productEventListener";
import { listenForOrderEvents } from "./events/orderEventListener";

const app = express();
app.use(express.json());
app.use("/api/search", searchRoutes);

export default async function initApp() {
  await listenForProductEvents();
  await listenForOrderEvents();
  return app;
}