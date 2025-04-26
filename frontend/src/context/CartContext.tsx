import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

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

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart }}>
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