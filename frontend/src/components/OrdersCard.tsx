import React from "react";
import { Card, Table, Spinner } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";

interface OrderCardProps {
  orders: any[];
  loading: boolean;
}

const OrdersCard: React.FC<OrderCardProps> = ({ orders, loading }) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">
          <FaWallet className="me-2" /> My Orders
        </Card.Title>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : orders.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <img
                      src={order.image || "https://via.placeholder.com/50"}
                      alt={order.name}
                      className="img-thumbnail"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{order.name}</td>
                  <td>{order.description}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>${order.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center">No order history available.</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrdersCard;