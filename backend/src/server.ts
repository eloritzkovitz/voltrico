import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from "path";
import fs from "fs";
import userRoutes from "./routes/userRoutes";
import itemRoutes from "./routes/itemRoutes";
import purchaseRoutes from "./routes/purchaseRoutes";

const app = express();

dotenv.config();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../dist/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../dist/uploads')));

// Connect to MongoDB
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/about", (req, res) => {
  res.send("This is the API for Voltrico.");
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Voltrico API",
      version: "1.0.0",
      description: "API server for Voltrico",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT, },
    ],
  },
  apis: [
    "./src/routes/userRoutes.ts",
    "./src/routes/itemRoutes.ts",
    "./src/routes/purchaseRoutes.ts"    
  ],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    if (process.env.DB_CONNECTION == undefined) {
      reject("DB_CONNECTION is not defined");
    } else {
      await mongoose.connect(process.env.DB_CONNECTION);
      resolve(app);
    }
  });
};

export default initApp;