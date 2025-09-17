import type { ICartItem as CartItem } from "@shared/interfaces/ICartItem";

// Add an item to the cart or increment its quantity if it already exists
export function addToCartHelper(cart: CartItem[], item: CartItem): CartItem[] {
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem._id === item._id
  );

  if (existingItemIndex !== -1) {
    // Increment the quantity of the existing item by 1
    const updatedCart = [...cart];
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: updatedCart[existingItemIndex].quantity + 1,
    };
    return updatedCart;
  }
  return [...cart, { ...item, quantity: 1 }];
}

// Remove an item from the cart
export function removeFromCartHelper(
  cart: CartItem[],
  itemId: string
): CartItem[] {
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem._id === itemId
  );

  if (existingItemIndex !== -1) {
    const updatedCart = [...cart];
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
  return cart;
}
