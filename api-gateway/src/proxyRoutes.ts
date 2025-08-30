import { Application } from "express-serve-static-core";
import httpProxy from "http-proxy";
import { registerProxyRoutes } from "@eloritzkovitz/server-essentials";

/**
 * Registers all proxy routes for Voltrico microservices.
 *
 * @param app - The Express application instance.
 * @param proxy - The http-proxy instance.
 */
export function setProxyRoutes(app: Application, proxy: httpProxy) {
  const routes = [
    {
      apiPath: "/api/auth",
      target: process.env.USER_SERVICE_URL ?? "",
      rewritePrefix: "/auth",
      serviceName: "user (auth)",
    },
    {
      apiPath: "/api/users",
      target: process.env.USER_SERVICE_URL ?? "",
      rewritePrefix: "/users",
      serviceName: "user",
    },
    {
      apiPath: "/api/products/search",
      target: process.env.SEARCH_SERVICE_URL ?? "",
      rewritePrefix: "/search/products",
      serviceName: "search (products)",
    },
    {
      apiPath: "/api/products",
      target: process.env.PRODUCT_SERVICE_URL ?? "",
      rewritePrefix: "/products",
      serviceName: "product",
    },
    {
      apiPath: "/api/orders/search",
      target: process.env.SEARCH_SERVICE_URL ?? "",
      rewritePrefix: "/search/orders",
      serviceName: "search (orders)",
    },
    {
      apiPath: "/api/orders",
      target: process.env.ORDER_SERVICE_URL ?? "",
      rewritePrefix: "/orders",
      serviceName: "order",
    },
    {
      apiPath: "/api/inventory",
      target: process.env.INVENTORY_SERVICE_URL ?? "",
      rewritePrefix: "/inventory",
      serviceName: "inventory",
    },
  ];

  registerProxyRoutes(app, proxy, routes);
}