import apiClient from "@/shared/api/client";

export const posQueryKeys = {
  employees: ["employees"],
  categories: ["categories"],
  menuItems: ["menu-items"],
  availableMenuItems: ["menu-items", "available"],
  discounts: ["discounts"],
  orders: ["orders"],
  orderStats: ["orders", "stats"],
};

const getArrayFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

export const getEmployees = async () => {
  const response = await apiClient.get("/employees");
  return getArrayFromPayload(response.data);
};

export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return getArrayFromPayload(response.data);
};

export const getMenuItems = async () => {
  const response = await apiClient.get("/menu-items");
  return getArrayFromPayload(response.data);
};

export const getAvailableMenuItems = async () => {
  const response = await apiClient.get("/menu-items/available");
  return getArrayFromPayload(response.data);
};

export const getDiscounts = async () => {
  const response = await apiClient.get("/discounts");
  return getArrayFromPayload(response.data);
};

export const getOrders = async (params = {}) => {
  const response = await apiClient.get("/orders", { params });
  return response.data;
};

export const getOrderStats = async (params = {}) => {
  const response = await apiClient.get("/orders/stats", { params });
  return response.data;
};

export const getOrderReceipt = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}/receipt`);
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await apiClient.post("/categories", payload);
  return response.data;
};

export const updateCategory = async ({ categoryId, payload }) => {
  const response = await apiClient.put(`/categories/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(`/categories/${categoryId}`);
  return response.data;
};

export const createMenuItem = async (payload) => {
  const isFormData = payload instanceof FormData;
  const response = await apiClient.post(
    "/menu-items",
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return response.data;
};

export const toggleMenuItemAvailability = async (menuItemId) => {
  const response = await apiClient.patch(`/menu-items/${menuItemId}/toggle-availability`);
  return response.data;
};

export const createOrder = async (payload) => {
  const response = await apiClient.post("/orders", payload);
  return response.data;
};

export const updateOrderStatus = async ({ orderId, payload }) => {
  const response = await apiClient.patch(`/orders/${orderId}/status`, payload);
  return response.data;
};
