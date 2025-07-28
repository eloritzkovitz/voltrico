import React, { useState } from "react";
import { Product } from "../services/product-service";
import { Button, Table } from "react-bootstrap";
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
      <Table striped bordered hover responsive className="items-table">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Category</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price (USD)</th>
            <th>In Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>
                <img
                  src={product.img || "/images/placeholder_image.png"}
                  alt={product.name}
                  className="img-thumbnail"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>{product.category}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product._id!)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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