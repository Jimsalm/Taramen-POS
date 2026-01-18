import { createApi } from '@reduxjs/toolkit/query/react';
import { rawBaseQuery } from '../../shared/lib/utils';

export const menuItemApi = createApi({
  reducerPath: 'menuItemApi',
  baseQuery: rawBaseQuery,
  tagTypes: ['MenuItem'],
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: (params) => ({
        url: '/menu-items',
        params,
      }),
      providesTags: ['MenuItem'],
    }),

    getMenuItem: builder.query({
      query: (id) => `/menu-items/${id}`,
      providesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),

    restoreMenuItem: builder.mutation({
      query: (id) => ({
        url: `/menu-items/${id}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),

    toggleMenuItemAvailability: builder.mutation({
      query: (id) => ({
        url: `/menu-items/${id}/toggle-availability`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),

    createMenuItem: builder.mutation({
      query: (menuItem) => ({
        url: '/menu-items',
        method: 'POST',
        body: menuItem,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    updateMenuItem: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/menu-items/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MenuItem', id }],
    }),

    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemQuery,
  useRestoreMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuItemApi;
