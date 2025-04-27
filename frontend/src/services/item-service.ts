import apiClient from "./api-client";
import Cookies from "js-cookie";

// Item interface
export interface Item {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  color?: string;
  madeIn?: string;
  weight?: string;
  imageURL?: string;
  stock?: number;
}

// Get all items
const getAllItems = async (): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>("/items");
  return response.data;
};

// Get item by ID
const getItemById = async (id: string): Promise<Item> => {
  const response = await apiClient.get<Item>(`/items/${id}`);
  return response.data;
};

// Get items by category
const getItemsByCategory = async (category: string): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>("/items/category", {
    params: { category },
  });
  return response.data;
};

// Get items by criteria
const getItemsByCriteria = async (criteria: {
  color?: string;
  madeIn?: string;
  weight?: string;
}): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>("/items/criteria", {
    params: criteria,
  });
  return response.data;
};

// Get items by query
const getItemsByQuery = async (query: string): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>("/items/search", {
    params: { query },
  });
  return response.data;
};

// Create a new item
const createItem = async (itemData: FormData): Promise<Item> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await apiClient.post<Item>("/items", itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update an item
const updateItem = async (id: string, itemData: FormData): Promise<Item> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await apiClient.put<Item>(`/items/${id}`, itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete an item
const deleteItem = async (id: string): Promise<{ message: string }> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await apiClient.delete<{ message: string }>(`/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getAllItems,
  getItemById,
  getItemsByCategory,
  getItemsByCriteria,
  getItemsByQuery,
  createItem,
  updateItem,
  deleteItem,
};