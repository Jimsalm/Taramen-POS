import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";

const queryKeys = {
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

const extractErrorMessage = (error, fallback) => {
  if (error?.response?.status === 503) {
    return "API service is temporarily unavailable (503). Please retry in a few moments.";
  }

  if (!error?.response) {
    return "Cannot reach API server. Check backend status and VITE_API_BASE_URL.";
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const requestCategories = async () => {
  const response = await apiClient.get("/categories");
  return getArrayFromPayload(response.data);
};

const requestMenuItems = async () => {
  const response = await apiClient.get("/menu-items");
  return getArrayFromPayload(response.data);
};

const requestAvailableMenuItems = async () => {
  const response = await apiClient.get("/menu-items/available");
  return getArrayFromPayload(response.data);
};

const requestOrders = async (params = {}) => {
  const response = await apiClient.get("/orders", { params });
  return response.data;
};

const requestOrderStats = async (params = {}) => {
  const response = await apiClient.get("/orders/stats", { params });
  return response.data;
};

const requestOrderReceipt = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}/receipt`);
  return response.data;
};

const requestDiscounts = async () => {
  const response = await apiClient.get("/discounts");
  return getArrayFromPayload(response.data);
};

const isSameEntityId = (left, right) => String(left) === String(right);

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: requestCategories,
  });

export const useMenuItems = () =>
  useQuery({
    queryKey: queryKeys.menuItems,
    queryFn: requestMenuItems,
  });

export const useAvailableMenuItems = () =>
  useQuery({
    queryKey: queryKeys.availableMenuItems,
    queryFn: requestAvailableMenuItems,
  });

export const useOrders = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...queryKeys.orders, params],
    queryFn: () => requestOrders(params),
    ...options,
  });

export const useOrderStats = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...queryKeys.orderStats, params],
    queryFn: () => requestOrderStats(params),
    ...options,
  });

export const useOrderReceipt = (orderId, options = {}) =>
  useQuery({
    queryKey: [...queryKeys.orders, orderId, "receipt"],
    queryFn: () => requestOrderReceipt(orderId),
    enabled: Boolean(orderId) && (options.enabled ?? true),
    ...options,
  });

export const useDiscounts = (options = {}) =>
  useQuery({
    queryKey: queryKeys.discounts,
    queryFn: requestDiscounts,
    ...options,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/categories", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, payload }) => {
      const response = await apiClient.put(`/categories/${categoryId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId) => {
      const response = await apiClient.delete(`/categories/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const isFormData = payload instanceof FormData;
      const response = await apiClient.post(
        "/menu-items",
        payload,
        isFormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
      queryClient.invalidateQueries({ queryKey: queryKeys.availableMenuItems });
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemId) => {
      const response = await apiClient.patch(`/menu-items/${menuItemId}/toggle-availability`);
      return response.data;
    },
    onSuccess: (payload, menuItemId) => {
      const responseData = payload?.data ?? {};
      const targetId = responseData?.id ?? menuItemId;
      const nextAvailability =
        typeof responseData?.available === "boolean"
          ? responseData.available
          : null;

      if (nextAvailability !== null) {
        queryClient.setQueryData(queryKeys.menuItems, (previous) => {
          if (!Array.isArray(previous)) return previous;

          return previous.map((item) => {
            if (!isSameEntityId(item?.id ?? item?.menu_item_id, targetId)) {
              return item;
            }

            return {
              ...item,
              available: nextAvailability,
              is_available: nextAvailability,
              is_active: nextAvailability,
            };
          });
        });

        queryClient.setQueryData(queryKeys.availableMenuItems, (previous) => {
          if (!Array.isArray(previous)) return previous;

          if (!nextAvailability) {
            return previous.filter(
              (item) =>
                !isSameEntityId(item?.id ?? item?.menu_item_id, targetId),
            );
          }

          const existingIndex = previous.findIndex((item) =>
            isSameEntityId(item?.id ?? item?.menu_item_id, targetId),
          );

          if (existingIndex !== -1) {
            return previous.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,
                    available: true,
                    is_available: true,
                    is_active: true,
                  }
                : item,
            );
          }

          const menuItemsCache = queryClient.getQueryData(queryKeys.menuItems);
          const matchedItem = Array.isArray(menuItemsCache)
            ? menuItemsCache.find((item) =>
                isSameEntityId(item?.id ?? item?.menu_item_id, targetId),
              )
            : null;

          if (!matchedItem) return previous;

          return [
            ...previous,
            {
              ...matchedItem,
              available: true,
              is_available: true,
              is_active: true,
            },
          ];
        });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
      queryClient.invalidateQueries({ queryKey: queryKeys.availableMenuItems });
    },
  });
};

export const useCreateOrder = () =>
  {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload) => {
        const response = await apiClient.post("/orders", payload);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders });
        queryClient.invalidateQueries({ queryKey: queryKeys.orderStats });
      },
    });
  };

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, payload }) => {
      const response = await apiClient.patch(`/orders/${orderId}/status`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.orderStats });
    },
  });
};

export { extractErrorMessage };
