import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.SEARCH_SERVICE_URL || "http://localhost:3005",
    changeOrigin: true,
    pathRewrite: { "^/api/search": "/api/search" },
  })
);

export default router;