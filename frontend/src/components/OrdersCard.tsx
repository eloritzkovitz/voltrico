import React from "react";
import { FaWallet } from "react-icons/fa";
import type { Order } from "@/types/order";

interface OrderCardProps {
  orders: Order[];
  loading: boolean;
}

const OrdersCard: React.FC<OrderCardProps> = ({ orders, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <FaWallet className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">My Orders</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <div
              key={order.id || `${order.date}-${index}`}
              className="bg-gray-50 rounded-lg shadow h-full flex flex-col"
            >
              <img
                src={order.product.imageURL || "/images/placeholder_image.png"}
                alt={order.product.name || "No name available"}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">
                  {order.product.name || "No name available"}
                </h3>
                <p className="text-gray-600 mb-2">
                  {order.product.description || "No description available"}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="font-bold text-blue-700 mt-auto">
                  Price: $
                  {order.product.price !== undefined ? order.product.price.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No order history available.
        </div>
      )}
    </div>
  );
};

export default OrdersCard;
