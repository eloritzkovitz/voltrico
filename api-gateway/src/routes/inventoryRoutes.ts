import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL || "http://localhost:3004",
    changeOrigin: true,
    pathRewrite: { "^/api/inventory": "/" },
  })
);

export default router;