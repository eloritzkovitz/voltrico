"use client";
import React, { useEffect, useState } from "react";
import OrdersTable from "@/components/OrdersTable";
import orderService, { Order } from "@/services/order-service";
import searchService from "@/services/search-service";

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
      const filteredOrders = await searchService.searchOrders(searchQuery);
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
    <div className="page-container mx-auto max-w-4xl py-8 px-4">
      <h4 className="text-2xl font-semibold mb-6">Manage Orders</h4>

      <main>
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by Customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={fetchOrders}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Orders Table or No Orders Message */}
        {loading ? (
          <div className="text-center text-gray-500">Loading data...</div>
        ) : orders.length > 0 ? (
          <OrdersTable orders={orders} />
        ) : (
          <div className="text-center text-gray-500">No orders available</div>
        )}
      </main>
    </div>
  );
};

export default Orders;
