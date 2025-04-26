import { Request, Response } from "express";
import Item from "../models/Item";

// Get all items
const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Get item by ID
const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Get items by category
const getItemsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const items = category && category !== 'all'
      ? await Item.find({ category })
      : await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Get items by criteria
const getItemsByCriteria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { color, madeIn, weight } = req.query;
    const query: Record<string, any> = {};

    if (color) query.color = color;
    if (madeIn) query.madeIn = madeIn;
    if (weight) query.weight = weight;

    const items = await Item.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Get items by query
const getItemsByQuery = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.query as string || '';
  try {
    const items = await Item.find({
      name: { $regex: new RegExp(query, 'i') }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Create item
const createItem = async (req: Request, res: Response): Promise<void> => {
  const { ...itemData } = req.body;
  const newItem = new Item(itemData);

  try {
    const savedItem = await newItem.save();    

    res.status(201).json({ ...savedItem.toObject() });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Update item
const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Delete item
const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Export all controllers as default
export default {
  getAllItems,
  getItemById,  
  getItemsByCategory,  
  getItemsByCriteria,  
  getItemsByQuery,
  createItem,
  updateItem,
  deleteItem  
};