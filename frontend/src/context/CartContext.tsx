"use client"
import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      setCart(storedCart ? JSON.parse(storedCart) : []);
      setIsInitialized(true);
    }
  }, []);

  // Calculate the total number of items in the cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add an item to the cart or increment its quantity if it already exists
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem._id === item._id);

      if (existingItemIndex !== -1) {
        // Increment the quantity of the existing item by 1
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Add the new item to the cart with a quantity of 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem._id === itemId);

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];

        if (existingItem.quantity > 1) {
          // Decrease the quantity by 1
          updatedCart[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity - 1,
          };
        } else {
          // Remove the item if the quantity is 1
          updatedCart.splice(existingItemIndex, 1);
        }

        return updatedCart;
      }

      return prevCart;
    });
  };

  // Clear cart content
  const clearCart = () => {
    setCart([]);
  };

  // Save the cart to localStorage whenever it changes (client only)
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
