import type { Product } from "./product";

// Cart item type for the shopping cart
export interface CartItem {
  productId: string;
  name?: string;
  price?: number;
  quantity: number;  
}

// Cart type for the backend cart service
export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  couponCode?: string;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Context type for the cart
export interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}
