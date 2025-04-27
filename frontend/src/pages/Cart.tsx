import React from "react";
import { Button, Table, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import orderService from "../services/order-service";

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  // Handle purchase of all items in the cart
  const handlePurchaseAll = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      if (!user || !user._id) {
        alert("You must be logged in to make a purchase.");
        return;
      }

      // Create orders for all items in the cart
      for (const item of cart) {
        await orderService.createOrder({
          customerId: user._id ?? "",
          itemId: item._id,
          date: new Date().toISOString(),
        });
      }

      // Clear the cart after successful purchase
      clearCart();

      alert("Thank you for your purchase!");
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Failed to complete the purchase. Please try again.");
    }
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