"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { useCart } from "@/context/CartContext";
import productService from "@/services/product-service";
import { Product } from "@/types/product";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();

  // Fetch all products on component mount
  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to fetch products. Please try again later.");
      });
  }, []);

  // Handle category button clicks
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      productService
        .getAllProducts()
        .then((data) => setProducts(data))
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to fetch products. Please try again later.");
        });
    } else {
      productService
        .getProductsByCategory(category)
        .then((data) => setProducts(data))
        .catch((error) => {
          console.error(error);
          setErrorMessage(
            "Failed to fetch products by category. Please try again later."
          );
        });
    }
  };

  // Handle adding a product to the cart
  const handleAddToCart = (product: Product) => {
    if (!product._id) {
      console.error("Product ID is missing. Cannot add to cart.");
      return;
    }

    addToCart({ ...product, quantity: 1, _id: product._id });
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {PRODUCT_CATEGORIES.map((button) => (
          <button
            key={button.category}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors
              ${
                selectedCategory === button.category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
              }`}
            onClick={() => handleCategoryClick(button.category)}
          >
            <span className="text-lg">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>

      {/* Shop Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {errorMessage && (
          <p className="col-span-full text-center text-red-600 font-medium">
            {errorMessage}
          </p>
        )}
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No products available at the moment.
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              viewMode="grid"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
