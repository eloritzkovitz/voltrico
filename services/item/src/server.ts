import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import itemRoutes from "./routes/itemRoutes";

const app = express();

dotenv.config();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../dist/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../dist/uploads')));

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

app.use("/api/items", itemRoutes);

app.get("/about", (req, res) => {
  res.send("This is the Item Service API for Voltrico.");
});

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