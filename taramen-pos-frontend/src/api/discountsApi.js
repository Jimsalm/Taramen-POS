import apiClient from "@/api/client";
import { getArrayFromPayload } from "./utils";

export const discountQueryKeys = {
  discounts: ["discounts"],
  activeDiscounts: ["discounts", "active"],
};

export const getDiscounts = async () => {
  const response = await apiClient.get("/discounts");
  return getArrayFromPayload(response.data);
};

export const getActiveDiscounts = async () => {
  const response = await apiClient.get("/discounts");
  return getArrayFromPayload(response.data).filter(
    (discount) => discount.active ?? discount.status ?? discount.is_active,
  );
};
