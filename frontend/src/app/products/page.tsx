"use client";
import React, { useEffect, useState } from "react";
import productService, { Product } from "@/services/product-service";
import CreateProductModal from "@/components/CreateProduct";
import ProductsTable from "@/components/ProductsTable";
import "@/styles/Products.css";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsByQuery(searchQuery);
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      fetchProducts(); // Refresh products
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="page-container mx-auto max-w-4xl py-8 px-4">
      <h4 className="text-2xl font-semibold mb-6">Manage Products</h4>

      <main>
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={fetchProducts}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Create Product Button */}
        <button
          onClick={() => setShowCreatePopup(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors mb-4"
        >
          Create Product
        </button>

        {/* Products Table or No Products Message */}
        {loading ? (
          <div className="text-center text-gray-500">Loading data...</div>
        ) : products.length > 0 ? (
          <ProductsTable products={products} onDelete={handleDeleteProduct} onEdit={fetchProducts} />
        ) : (
          <div className="text-center text-gray-500">No products available</div>
        )}

        {/* Create Product Modal */}
        <CreateProductModal
          show={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          onCreate={fetchProducts}
        />
      </main>
    </div>
  );
};

export default Products;