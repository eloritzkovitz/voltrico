import { Request, Response } from "express";
import Product from "../models/Product";

// Get all products
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Get product by ID
const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Create product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { ...productData } = req.body;
  const newProduct = new Product(productData);

  try {
    const savedProduct = await newProduct.save();

    res.status(201).json({ ...savedProduct.toObject() });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Update product
const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Delete product
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Export all controllers as default
export default {
  getAllProducts,
  getProductById,  
  createProduct,
  updateProduct,
  deleteProduct
};