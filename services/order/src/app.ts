import dotenv from "dotenv";
import { logger } from "@eloritzkovitz/server-essentials";
import initApp from "./server";

// Load the appropriate .env file based on NODE_ENV
const env = process.env.NODE_ENV || "dev";
dotenv.config({
  path: (() => {
    switch (env) {
      case "production":
        return ".env.prod";
      case "test":
        return ".env.test";
      case "development":
        return ".env.dev";
      default:
        return ".env";
    }
  })(),
});

const port: number = Number(process.env.PORT) || 3005;

initApp()
  .then((app) => {
    app.listen(port, () => {
      logger.info(`Order service running on port ${port} (Environment: ${env})`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start order service: %o", err);
    process.exit(1);
  });
