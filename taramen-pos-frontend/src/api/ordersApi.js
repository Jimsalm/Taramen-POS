import apiClient from "@/api/client";

export const orderQueryKeys = {
  orders: ["orders"],
  orderStats: ["orders", "stats"],
};

export const getOrders = async (params = {}) => {
  const response = await apiClient.get("/orders", { params });
  return response.data;
};

export const getOrderStats = async (params = {}) => {
  const response = await apiClient.get("/orders/stats", { params });
  return response.data;
};

export const getOrderReceipt = async (id) => {
  const response = await apiClient.get(`/orders/${id}/receipt`);
  return response.data;
};

export const createOrder = async (payload) => {
  const response = await apiClient.post("/orders", payload);
  return response.data;
};

export const updateOrderStatus = async ({ id, payload }) => {
  const response = await apiClient.patch(`/orders/${id}/status`, payload);
  return response.data;
};
