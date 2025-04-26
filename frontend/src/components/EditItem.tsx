import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import itemService, { Item } from "../services/item-service";

interface EditItemModalProps {
  show: boolean;
  onClose: () => void;
  item: Item;
  onEdit: () => void; // Callback to refresh items after editing
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  show,
  onClose,
  item,
  onEdit,
}) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description || "");
  const [price, setPrice] = useState(item.price.toString());
  const [stock, setStock] = useState(item.stock?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedItem = new FormData();
      updatedItem.append("name", name);
      updatedItem.append("category", category);
      updatedItem.append("description", description);
      updatedItem.append("price", price);
      updatedItem.append("stock", stock);

      if (item._id) {
        updatedItem.append("_id", item._id);
      }

      await itemService.updateItem(item._id!, updatedItem);

      onEdit(); // Notify parent to refresh items
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Name Input */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item name"
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
              placeholder="Enter item description"
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
              placeholder="Enter item price"
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
              {isLoading ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditItemModal;