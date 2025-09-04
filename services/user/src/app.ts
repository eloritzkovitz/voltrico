import dotenv from "dotenv";
import initApp from "./server";
import { logger } from "@eloritzkovitz/server-essentials";

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

const port: number = Number(process.env.PORT) || 3002;

initApp()
  .then((app) => {
    app.listen(port, () => {
      logger.info(`User service running on port ${port} (Environment: ${env})`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start User service: %o", err);
    process.exit(1);
  });
