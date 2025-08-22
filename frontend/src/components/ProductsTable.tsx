"use client";
import { useState } from "react";
import { Product } from "@/types/product";
import EditProductModal from "./EditProduct";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ProductsTable: React.FC<ProductTableProps> = ({ products, onDelete, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Price (USD)</th>
              <th className="py-2 px-4">In Stock</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="py-2 px-4">{product._id}</td>
                <td className="py-2 px-4">
                  <img
                    src={product.imageURL || "/images/placeholder_image.png"}
                    alt={product.name}
                    className="rounded object-cover"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.description}</td>
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm mr-2"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={() => onDelete(product._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={selectedProduct}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default ProductsTable;