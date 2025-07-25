import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import path from "path";
import fs from "fs";

const app = express();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../dist/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../dist/uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/users", userRoutes);

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    if (!process.env.DB_CONNECTION) {
      reject("DB_CONNECTION is not defined");
    } else {
      await mongoose.connect(process.env.DB_CONNECTION);
      resolve(app);
    }
  });
};

export default initApp;