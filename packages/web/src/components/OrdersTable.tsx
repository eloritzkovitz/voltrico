import { Order } from "@/types/order";

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Customer ID</th>
            <th className="py-2 px-4">Product ID</th>
            <th className="py-2 px-4">Product Name</th>
            <th className="py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-t">
              <td className="py-2 px-4">{order.orderId}</td>
              <td className="py-2 px-4">{order.customerId}</td>
              <td className="py-2 px-4">{order.productId}</td>
              <td className="py-2 px-4">{order.product.name || "No name available"}</td>
              <td className="py-2 px-4">{new Date(order.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;