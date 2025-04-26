import React from "react";
import { Button, Table, Alert } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const handlePurchaseAll = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Simulate purchase logic
    alert("Thank you for your purchase!");
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.imageURL || "/images/placeholder_image.png"}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={handlePurchaseAll}>
              Purchase All
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;