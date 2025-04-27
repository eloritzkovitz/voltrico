import React, { useState } from "react";
import { Item } from "../services/item-service";
import { Button, Table } from "react-bootstrap";
import EditItemModal from "./EditItem";

interface ItemsTableProps {
  items: Item[];
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, onDelete, onEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
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
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>
                <img
                  src={item.imageURL || "/images/placeholder_image.png"}
                  alt={item.name}
                  className="img-thumbnail"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.stock}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item._id!)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Item Modal */}
      {selectedItem && (
        <EditItemModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          item={selectedItem}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default ItemsTable;