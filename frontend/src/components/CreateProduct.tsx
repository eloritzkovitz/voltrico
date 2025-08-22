"use client";
import { useState } from "react";
import { productCategoriesList } from "@/constants/productCategories";
import productService from "@/services/product-service";

interface CreateProductModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  show,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);

      // Call the create product service directly
      await productService.createProduct(formData);

      // Reset form fields after successful product creation
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");

      onCreate(); // Notify parent to refresh items
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product");
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
        <h2 className="text-xl font-semibold mb-4 text-center">Create Item</h2>
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
              {productCategoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Stock Count
            </label>
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
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
