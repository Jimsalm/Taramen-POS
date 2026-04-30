import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createCategory,
  deleteCategory,
  categoryQueryKeys,
  getCategories,
  updateCategory,
} from "@/api/categoriesApi";
import {
  createMenuItem,
  getMenuItems,
  menuItemQueryKeys,
  toggleMenuItemAvailability,
} from "@/api/menuItemsApi";
import { queryClient } from "@/shared/lib/query-client";

export const MENU_KEYS = {
  categories: categoryQueryKeys.categories,
  menuItems: menuItemQueryKeys.menuItems,
  availableMenuItems: menuItemQueryKeys.availableMenuItems,
};

export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: MENU_KEYS.categories,
    queryFn: getCategories,
    ...options,
  });
};

export const useMenuItems = (options = {}) => {
  return useQuery({
    queryKey: MENU_KEYS.menuItems,
    queryFn: getMenuItems,
    ...options,
  });
};

export const useCreateCategory = (options = {}) => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories });
    },
    ...options,
  });
};

export const useUpdateCategory = (options = {}) => {
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories });
    },
    ...options,
  });
};

export const useDeleteCategory = (options = {}) => {
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories });
    },
    ...options,
  });
};

export const useCreateMenuItem = (options = {}) => {
  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.menuItems });
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.availableMenuItems });
    },
    ...options,
  });
};

export const useToggleMenuItemAvailability = (options = {}) => {
  return useMutation({
    mutationFn: toggleMenuItemAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.menuItems });
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.availableMenuItems });
    },
    ...options,
  });
};
