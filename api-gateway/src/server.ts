import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import itemRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import searchRoutes from "./routes/searchRoutes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proxy routes
app.use("/api/users", userRoutes);
app.use("/api/products", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("Voltrico API Gateway is running.");
});

export default app;