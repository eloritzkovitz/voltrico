import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import orderService, { Order } from "../services/order-service";
import OrdersTable from "../components/OrdersTable";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderHistory();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const filteredOrders = orders.filter((order) =>
        order.customerId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error searching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page-container">
      <header>
        <h2>Manage Orders</h2>
      </header>

      <main>
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />
          <Button onClick={handleSearch} variant="primary" className="mx-2">
            Search
          </Button>
          <Button onClick={fetchOrders} variant="secondary">
            Reset
          </Button>
        </div>

        {/* Orders Table or No Orders Message */}
        {loading ? (
          <div id="loadingIndicator">Loading data...</div>
        ) : orders.length > 0 ? (
          <OrdersTable orders={orders} />
        ) : (
          <div id="noOrdersMessage">No orders available</div>
        )}
      </main>
    </div>
  );
};

export default Orders;