import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
import { Response } from "express-serve-static-core";

const app = express();

// Enable CORS from frontend origin
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const proxy = httpProxy.createProxyServer();

const userServiceUrl = "http://user-service:3002";
const productServiceUrl = "http://product-service:3003";
const orderServiceUrl = "http://order-service:3004";
const inventoryServiceUrl = "http://inventory-service:3005";
const searchServiceUrl = "http://search-service:3006";

// ---------- USERS + AUTH ----------
app.use("/api/auth", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/auth/, "/auth");
  proxy.web(req, res, { target: userServiceUrl }, handleProxyError(res, "user (auth)"));
});

app.use("/api/users", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/users/, "/users");
  proxy.web(req, res, { target: userServiceUrl }, handleProxyError(res, "user"));
});

// ---------- PRODUCTS ----------
app.use("/api/products/search", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/products\/search/, "/search/products");
  proxy.web(req, res, { target: searchServiceUrl }, handleProxyError(res, "search (products)"));
});

app.use("/api/products", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/products/, "/products");
  proxy.web(req, res, { target: productServiceUrl }, handleProxyError(res, "product"));
});

// ---------- ORDERS ----------
app.use("/api/orders/search", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/orders\/search/, "/search/orders");
  proxy.web(req, res, { target: searchServiceUrl }, handleProxyError(res, "search (orders)"));
});

app.use("/api/orders", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/orders/, "/orders");
  proxy.web(req, res, { target: orderServiceUrl }, handleProxyError(res, "order"));
});

// ---------- INVENTORY ----------
app.use("/api/inventory", (req, res) => {
  req.url = req.originalUrl.replace(/^\/api\/inventory/, "/inventory");
  proxy.web(req, res, { target: inventoryServiceUrl }, handleProxyError(res, "inventory"));
});

// ---------- LOGGING ----------
proxy.on("proxyReq", (proxyReq, req, res, options) => {
  console.log(`Forwarded request to ${options.target}: ${req.method} ${req.url}`);
});

app.get("/", (req, res) => {
  res.send("Voltrico API Gateway is running.");
});

// ---------- Helper ----------
function handleProxyError(res: Response<any, Record<string, any>, number>, serviceName: string) {
  return (err: { message: any; }) => {
    console.error(`Error forwarding to ${serviceName} service: ${err.message}`);
    res.status(500).send("Internal Server Error");
  };
}

app.get("/", (req, res) => {
  res.send("Voltrico API Gateway is running.");
});

export default app;