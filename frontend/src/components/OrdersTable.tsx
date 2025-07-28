import React from "react";
import { Table } from "react-bootstrap";
import { Order } from "../services/order-service";

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Order ID</th>
          <th>Customer ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.orderId}>
            <td>{order.orderId}</td>
            <td>{order.customerId}</td>
            <td>{order.productId}</td>
            <td>{order.product?.name || "No name available"}</td>
            <td>{new Date(order.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrdersTable;