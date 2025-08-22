import type { Product } from "./product";

// Cart item type for the shopping cart
export interface CartItem extends Product {
  quantity: number;
}

// Context type for the cart
export interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}
