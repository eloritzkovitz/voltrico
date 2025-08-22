"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, CartContextType } from "@/types/cart";
import { addToCartHelper, removeFromCartHelper } from "@/utils/cartHelpers";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("cart");
        setCart(storedCart ? (JSON.parse(storedCart) as CartItem[]) : []);
      } catch {
        setCart([]);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save the cart to localStorage whenever it changes (client only)
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, isInitialized]);

  // Calculate the total number of items in the cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Use add to cart helper
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => addToCartHelper(prevCart, item));
  };

  // Use remove from cart helper
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => removeFromCartHelper(prevCart, itemId));
  };

  // Clear cart content
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
