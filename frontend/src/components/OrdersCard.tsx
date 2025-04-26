import React from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";

interface Order {
  id: string;
  name: string;
  description: string;
  date: string;
  price: number;
  image?: string;
}

interface OrderCardProps {
  orders: Order[];
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
          <Row className="g-4">
            {orders.map((order, index) => (
              <Col key={order.id || `${order.date}-${index}`} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={order.image || "/images/placeholder_image.png"}
                    alt={order.name || "No name available"}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{order.name || "No name available"}</Card.Title>
                    <Card.Text>
                      {order.description || "No description available"}
                    </Card.Text>
                    <Card.Text>
                      <small className="text-muted">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </small>
                    </Card.Text>
                    <Card.Text>
                      <strong>Price: ${order.price.toFixed(2)}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center">No order history available.</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrdersCard;