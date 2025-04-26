import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import itemService, { Item } from "../services/item-service";
import CreateItemModal from "../components/CreateItem";
import ItemsTable from "../components/ItemsTable";
import "../styles/Items.css";

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItemsByQuery(searchQuery);
      setItems(data);
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    try {
      await itemService.deleteItem(id);
      fetchItems(); // Refresh items
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="page-container">
      <header>
        <h2>Manage Items</h2>
      </header>

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
          <Button onClick={fetchItems} variant="secondary">
            Reset
          </Button>
        </div>

        {/* Create Item Button */}
        <Button onClick={() => setShowCreatePopup(true)} variant="primary" className="my-3">
          Create Item
        </Button>

        {/* Items Table or No Items Message */}
        {loading ? (
          <div id="loadingIndicator">Loading data...</div>
        ) : items.length > 0 ? (
          <ItemsTable items={items} onDelete={handleDeleteItem} onEdit={fetchItems} />
        ) : (
          <div id="noItemsMessage">No items available</div>
        )}

        {/* Create Item Modal */}
        <CreateItemModal
          show={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          onCreate={fetchItems}
        />
      </main>
    </div>
  );
};

export default Items;