import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import productService from "../services/product-service";

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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Item</Modal.Title>
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
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Item"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProductModal;