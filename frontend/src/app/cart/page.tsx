import React from "react";
import Image from "next/image";
import { DEFAULT_PRODUCT_IMAGE, EMPTY_CART_IMAGE } from "@/constants/assets";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import orderService from "@/services/order-service";

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

      for (const item of cart) {
        await orderService.createOrder({
          customerId: user._id ?? "",
          productId: item._id,
          date: new Date().toISOString(),
          product: item,
        });
      }

      clearCart();
      alert("Thank you for your purchase!");
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Failed to complete the purchase. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <div className="mt-4 container mx-auto px-4">
        <h4 className="text-2xl font-semibold mb-4">Your Shopping Cart</h4>
        {cart.length === 0 ? (
          <div className="empty-cart text-center mt-4">
            <Image
              src={EMPTY_CART_IMAGE}
              alt="Empty Cart"
              width={80}
              height={80}
              className="mx-auto mb-4 w-20 h-20 object-cover"
            />
            <h2 className="text-xl font-medium">Your cart is empty</h2>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-2 px-4">Image</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Total</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="py-2 px-4">
                        <Image
                          src={item.imageURL || DEFAULT_PRODUCT_IMAGE}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
                onClick={handlePurchaseAll}
              >
                Purchase All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
