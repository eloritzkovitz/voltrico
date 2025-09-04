import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
import { setProxyRoutes } from "./proxyRoutes";
import { httpLogger, logger } from "@eloritzkovitz/server-essentials";

const app = express();

// Middleware setup
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(httpLogger);

// Set up proxy routes
const proxy = httpProxy.createProxyServer();
setProxyRoutes(app, proxy);

proxy.on("proxyReq", (proxyReq, req, res, options) => {
  logger.info(`Forwarded request to ${options.target}: ${req.method} ${req.url}`);
});

app.get("/", (req, res) => {
  res.send("Voltrico API Gateway is running.");
});

export default app;