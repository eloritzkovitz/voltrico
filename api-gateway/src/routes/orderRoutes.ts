import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "" },
    ws: true,
  })
);

router.get(
  "/search",
  createProxyMiddleware({
    target: process.env.SEARCH_SERVICE_URL || "http://localhost:3005",
    changeOrigin: true,
    pathRewrite: { "^/api/orders/search": "/api/search/orders" },
  })
);

export default router;