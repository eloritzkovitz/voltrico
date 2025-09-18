import apiClient from "./api-client";
import Cookies from "js-cookie";
import type { ICart as Cart } from "@shared/interfaces/ICart";
import type { ICartItem as CartItem } from "@shared/interfaces/ICartItem";
import { getOrCreateGuestSessionId } from "@/utils/guestSessionHelpers";

// Helper to build auth headers from cookie
const authHeaders = () => {
  const token = Cookies.get("accessToken");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  // If not authenticated, send guest session ID
  const guestSessionId = getOrCreateGuestSessionId();
  return guestSessionId ? { "x-guest-session-id": guestSessionId } : {};
};

// Get cart by userId or sessionId
export const getCart = async (id: string) => {
  const res = await apiClient.get<Cart>(`/cart/${id}`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

// Add item to cart
export const addCartItem = async (id: string, item: CartItem) => {
  const res = await apiClient.post<Cart>(`/cart/${id}/items`, item, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

// Update item in cart
export const updateCartItem = async (
  id: string,
  itemIndex: number,
  item: Partial<CartItem>
) => {
  const res = await apiClient.put<Cart>(`/cart/${id}/items/${itemIndex}`, item, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

// Remove item from cart
export const removeCartItem = async (id: string, itemIndex: number) => {
  const res = await apiClient.delete<Cart>(`/cart/${id}/items/${itemIndex}`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

// Clear all items from cart
export const clearCart = async (id: string) => {
  const res = await apiClient.post<Cart>(`/cart/${id}/clear`, null, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};
