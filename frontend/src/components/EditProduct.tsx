import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import productService, { Product } from "../services/product-service";

interface EditProductModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
  onEdit: () => void; // Callback to refresh products after editing
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

      onEdit(); // Notify parent to refresh products
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Name Input */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Category Input */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="TV">TV</option>
              <option value="Computers">Computers</option>
              <option value="Mobile">Mobile</option>
              <option value="Appliances">Appliances</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Tools">Tools</option>
              <option value="Lighting">Lighting</option>
            </Form.Select>
          </Form.Group>

          {/* Description Input */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          {/* Price Input */}
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          {/* Stock Input */}
          <Form.Group className="mb-3">
            <Form.Label>Stock Count</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter stock count"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="1"
              step="1"
              required
            />
          </Form.Group>

          {/* Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Action Buttons */}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;