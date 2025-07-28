import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: { "^/api/products": "" },
    ws: true,
  })
);

export default router;