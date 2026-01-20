import { createApi } from '@reduxjs/toolkit/query/react';
import { rawBaseQuery } from '../../shared/lib/utils';

export const discountApi = createApi({
  reducerPath: 'discountApi',
  baseQuery: rawBaseQuery,
  tagTypes: ['Discount'],
  endpoints: (builder) => ({
    getDiscounts: builder.query({
      query: (params) => ({
        url: '/discounts',
        params,
      }),
      providesTags: ['Discount'],
    }),

    getDiscount: builder.query({
      query: (id) => `/discounts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Discount', id }],
    }),

    getAllActiveDiscounts: builder.query({
      query: () => '/discounts/getActive',
      providesTags: ['Discount'],
    }),

    createDiscount: builder.mutation({
      query: (discount) => ({
        url: '/discounts',
        method: 'POST',
        body: discount,
      }),
      invalidatesTags: ['Discount'],
    }),

    updateDiscount: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/discounts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Discount', id }],
    }),

    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/discounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discount'],
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useGetDiscountQuery,
  useGetAllActiveDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;
