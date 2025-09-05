import { Request, Response } from "express";
import { handleError, logger } from "@eloritzkovitz/server-essentials";
import Product from "../models/Product";

// Get all products
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  logger.info("Get all products request");
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    logger.error("Error fetching products", { error: (err as Error).message });
    handleError(res, "Error fetching products", err);
  }
};

// Get product by ID
const getProductById = async (req: Request, res: Response): Promise<void> => {
  logger.info("Get product by ID request", { productId: req.params.id });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn("Product not found", { productId: req.params.id });
      handleError(res, "Product not found", undefined, 404);
      return;
    }
    res.json(product);
  } catch (err) {
    logger.error("Error fetching product by ID", { error: (err as Error).message });
    handleError(res, "Error fetching product by ID", err);
  }
};

// Create product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  logger.info("Create product request", { productData: req.body });
  const { ...productData } = req.body;
  const newProduct = new Product(productData);

  try {
    const savedProduct = await newProduct.save();
    logger.info("Product created", { productId: savedProduct._id });
    res.status(201).json({ ...savedProduct.toObject() });
  } catch (err) {
    logger.error("Error creating product", { error: (err as Error).message });
    handleError(res, "Error creating product", err, 400);
  }
};

// Update product
const updateProduct = async (req: Request, res: Response): Promise<void> => {
  logger.info("Update product request", { productId: req.params.id, update: req.body });
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      logger.warn("Product not found for update", { productId: req.params.id });
      handleError(res, "Product not found", undefined, 404);
      return;
    }
    logger.info("Product updated", { productId: updatedProduct._id });
    res.json(updatedProduct);
  } catch (err) {
    logger.error("Error updating product", { error: (err as Error).message });
    handleError(res, "Error updating product", err, 400);
  }
};

// Delete product
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  logger.info("Delete product request", { productId: req.params.id });
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      logger.warn("Product not found for deletion", { productId: req.params.id });
      handleError(res, "Product not found", undefined, 404);
      return;
    }
    logger.info("Product deleted", { productId: req.params.id });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    logger.error("Error deleting product", { error: (err as Error).message });
    handleError(res, "Error deleting product", err, 400);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
