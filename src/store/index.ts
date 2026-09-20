import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { menuApi } from './menuApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      [menuApi.reducerPath]: menuApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(menuApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
