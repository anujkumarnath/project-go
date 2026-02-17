import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../auth/authApi';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_USER_API_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (email) => `/users/${encodeURIComponent(email)}`,
      providesTags: (_result, _error, email) => [{ type: 'Users', id: email }],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ email, newEmail, ...updates }) => ({
        url: `/users/${encodeURIComponent(email)}`,
        method: 'PUT',
        body: { ...updates, ...(newEmail !== undefined && { email: newEmail }) },
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (email) => ({
        url: `/users/${encodeURIComponent(email)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
