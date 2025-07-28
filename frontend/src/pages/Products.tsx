import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import productService, { Product } from "../services/product-service";
import CreateProductModal from "../components/CreateProduct";
import ProductsTable from "../components/ProductsTable";
import "../styles/Products.css";

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
    <div className="page-container">
      <h4>Manage Products</h4>

      <main>
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />
          <Button onClick={handleSearch} variant="primary" className="mx-2">
            Search
          </Button>
          <Button onClick={fetchProducts} variant="secondary">
            Reset
          </Button>
        </div>

        {/* Create Product Button */}
        <Button onClick={() => setShowCreatePopup(true)} variant="primary" className="my-3">
          Create Product
        </Button>

        {/* Products Table or No Products Message */}
        {loading ? (
          <div id="loadingIndicator">Loading data...</div>
        ) : products.length > 0 ? (
          <ProductsTable products={products} onDelete={handleDeleteProduct} onEdit={fetchProducts} />
        ) : (
          <div id="noProductsMessage">No products available</div>
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