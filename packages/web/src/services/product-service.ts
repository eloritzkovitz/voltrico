import apiClient from "./api-client";
import Cookies from "js-cookie";
import { Product } from "@/types/product";

// Get all products
const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products:", error?.message || error);
    return [];
  }
};

// Get product by ID
const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch product by ID:", error?.message || error);
    return null;
  }
};

// Get products by category
const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products/category", {
      params: { category },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products by category:", error?.message || error);
    return [];
  }
};

// Get products by criteria
const getProductsByCriteria = async (criteria: {
  color?: string;
  madeIn?: string;
  weight?: string;
}): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products/criteria", {
      params: criteria,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products by criteria:", error?.message || error);
    return [];
  }
};

// Create a new product
const createProduct = async (productData: FormData): Promise<Product> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await apiClient.post<Product>("/products", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update a product
const updateProduct = async (id: string, productData: FormData): Promise<Product> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await apiClient.put<Product>(`/products/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete a product
const deleteProduct = async (id: string): Promise<{ message: string }> => {
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
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCriteria,
  createProduct,
  updateProduct,
  deleteProduct,
};