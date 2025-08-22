"use client";
import React, { useEffect, useState } from "react";
import CategoryButtons from "@/components/CategoryButtons";
import ProductList from "@/components/ProductList";
import { useProductList } from "@/hooks/useProductList";
import productService from "@/services/product-service";
import { Product } from "@/types/product";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use the custom hook for product list management
  const {
    selectedCategory,
    filteredItems,
    setFilteredItems,
    handleAddToCart,
    handleCategoryChange,
  } = useProductList(products);  

  // Fetch all products on component mount
  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => {
        setProducts(data);
        setFilteredItems(data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to fetch products. Please try again later.");
      });
  }, [setFilteredItems]);  

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Category Buttons */}
      <CategoryButtons
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => handleCategoryChange(category, products)}
        items={products}
      />

      {/* Product List */}
      <ProductList
        products={filteredItems ?? []}
        onAddToCart={handleAddToCart}
        viewMode="grid"
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default MainPage;
