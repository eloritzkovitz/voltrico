import apiClient from "./api-client";

// Search for products by query
const searchProducts = async (query: string) => {
  try {
    const response = await apiClient.get("/product/search", { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

// Search for orders by query
const searchOrders = async (query: string) => {
  try {
    const response = await apiClient.get("/order/search", { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Order search failed:", error);
    return [];
  }
};

export default {
  searchProducts,
  searchOrders,
};
