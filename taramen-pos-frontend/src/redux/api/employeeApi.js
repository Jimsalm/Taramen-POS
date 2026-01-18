import { createApi } from '@reduxjs/toolkit/query/react';
import { rawBaseQuery } from '../../shared/lib/utils';

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: rawBaseQuery,
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params) => ({
        url: '/employees',
        params,
      }),
      providesTags: ['Employee'],
    }),

    getEmployee: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    getAllEmployees: builder.query({
      query: () => '/employees/all',
      providesTags: ['Employee'],
    }),

    toggleEmployeeStatus: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Employee'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useGetAllEmployeesQuery,
  useToggleEmployeeStatusMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
