import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
    ws: true,
  })
);

export default router;