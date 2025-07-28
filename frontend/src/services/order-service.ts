import apiClient from "./api-client";

export interface Order {
  orderId: string;
  customerId: string;
  productId: string;
  date: string;
  product?: {
    name: string;
  };
}

// Create a new order
const createOrder = async (orderData: Omit<Order, "orderId">): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Fetch order history
const getOrderHistory = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderHistory,
};