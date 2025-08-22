import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export function useProductList(initialItems: Product[] = []) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredItems, setFilteredItems] = useState<Product[]>(initialItems);
  const { addToCart } = useCart();

  // Handle adding an item to the cart
  const handleAddToCart = (item: Product) => {
    if (!item._id) {
      console.error("Product ID is missing. Cannot add to cart.");
      return;
    }
    addToCart({ ...item, quantity: 1, _id: item._id });
  };

  // Handle category change
  const handleCategoryChange = (category: string, items: Product[]) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === category));
    }
  };

  return {
    selectedCategory,
    filteredItems,
    setFilteredItems,
    setSelectedCategory,
    handleAddToCart,
    handleCategoryChange,
  };
}