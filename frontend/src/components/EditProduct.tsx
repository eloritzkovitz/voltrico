"use client";
import { useState } from "react";
import { categories } from "@/constants/categories";
import productService, { Product } from "@/services/product-service";

interface EditProductModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
  onEdit: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  onClose,
  product,
  onEdit,
}) => {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedProduct = new FormData();
      updatedProduct.append("name", name);
      updatedProduct.append("category", category);
      updatedProduct.append("description", description);
      updatedProduct.append("price", price);
      updatedProduct.append("stock", stock);

      if (product._id) {
        updatedProduct.append("_id", product._id);
      }

      await productService.updateProduct(product._id!, updatedProduct);

      onEdit();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {/* Stock Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock Count</label>
            <input
              type="number"
              placeholder="Enter stock count"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="1"
              step="1"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center font-medium">{error}</div>
          )}
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;