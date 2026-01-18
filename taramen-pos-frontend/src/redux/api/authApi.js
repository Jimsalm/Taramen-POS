import { createApi } from '@reduxjs/toolkit/query/react';
import { rawBaseQuery } from '../../shared/lib/utils';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: rawBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),

    checkSession: builder.query({
      query: () => `/auth/check?t=${Date.now()}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useCheckSessionQuery,
} = authApi;
