import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ITEM_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: { "^/api/items": "" },
    ws: true,
  })
);

export default router;