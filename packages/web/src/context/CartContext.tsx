"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCart,
  addCartItem,
  removeCartItem,
  clearCart,
} from "@/services/cart-service";
import type { ICart as Cart } from "@shared/interfaces/ICart.js";
import type { ICartItem as CartItem } from "@shared/interfaces/ICartItem.js";
import type { CartContextType } from "@/types/cart";
import {
  getOrCreateGuestSessionId,
  clearGuestSessionId,
} from "@/utils/guestSessionHelpers";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Use userId if authenticated, otherwise use a guest session ID
  const userId: string =
    isAuthenticated && user && user._id
      ? user._id
      : getOrCreateGuestSessionId();

  // Clear guest session ID when user logs in
  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      clearGuestSessionId();
    }
  }, [isAuthenticated, user]);

  // Load cart from backend when userId changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data: Cart = await getCart(userId);
        setCart(data.items || []);
      } catch {
        setCart([]);
      }
    };
    fetchCart();
  }, [userId]);

  // Add item to cart via backend
  const addToCart = async (item: CartItem) => {
    try {
      const data: Cart = await addCartItem(userId, item);
      setCart(data.items || []);
    } catch {}
  };

  // Remove item from cart via backend
  const removeFromCart = async (itemId: string) => {
    try {
      const itemIndex = cart.findIndex((item) => item.productId === itemId);
      if (itemIndex === -1) return;
      const data: Cart = await removeCartItem(userId, itemIndex);
      setCart(data.items || []);
    } catch {}
  };

  // Clear cart via backend
  const clearCartHandler = async () => {
    try {
      const data: Cart = await clearCart(userId);
      setCart(data.items || []);
    } catch {}
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart: clearCartHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
