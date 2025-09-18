import type { ICartItem as CartItem } from "@shared/interfaces/ICartItem.js";

// Context type for the cart
export interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}
