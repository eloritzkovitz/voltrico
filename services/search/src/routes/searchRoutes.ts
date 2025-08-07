import express from "express";
import { searchProducts } from "../controllers/searchController";

const router = express.Router();

router.get("/products", searchProducts);

export default router;