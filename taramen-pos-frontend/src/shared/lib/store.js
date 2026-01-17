import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    loading: (state = { isLoading: false }, action) => {
      switch (action.type) {
        case 'SET_LOADING':
          return { isLoading: action.payload };
        default:
          return state;
      }
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
