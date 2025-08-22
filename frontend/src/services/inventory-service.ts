import apiClient from "./api-client";
import { InventoryItem } from "@/types/inventory";

// Get stock for an item
export const getStock = async (itemId: string): Promise<InventoryItem> => {
  const response = await apiClient.get<InventoryItem>(`/inventory/${itemId}`);
  return response.data;
};

// Set stock for an item
export const setStock = async (itemId: string, stock: number): Promise<void> => {
  await apiClient.put(`/inventory/${itemId}`, { stock });
};

// Update stock for an item
export const updateStock = async (itemId: string, change: number): Promise<void> => {
  await apiClient.post(`/inventory/${itemId}/update`, null, {
    params: { change }
  });
};

export default {
  getStock,
  setStock,
  updateStock,
};