import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { usersApi } from '../features/users/usersApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware),
});
