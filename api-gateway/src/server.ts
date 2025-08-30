import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
import { registerProxyRoutes } from "./proxyRoutes";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const proxy = httpProxy.createProxyServer();
registerProxyRoutes(app, proxy);

proxy.on("proxyReq", (proxyReq, req, res, options) => {
  console.log(`Forwarded request to ${options.target}: ${req.method} ${req.url}`);
});

app.get("/", (req, res) => {
  res.send("Voltrico API Gateway is running.");
});

export default app;