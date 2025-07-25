import dotenv from "dotenv";
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

const port = process.env.PORT || 3003;

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Order service running on port ${port} (Environment: ${env})`);
  });
});