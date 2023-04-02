import { configureStore } from "@reduxjs/toolkit";

import hotelReducer from "../features/hotel/hotelSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";
import clientReducer from "../features/clientSlice";
import excursionReducer from "../features/excursion/excursionSlice";
import adminReducer from "../features/adminSlice";

import { baseApi } from "../features/services/base.service";

import roomSlice from "../features/room/roomSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    orders: orderReducer,
    client: clientReducer,
    excursions: excursionReducer,
    admin: adminReducer,

    [baseApi.reducerPath]: baseApi.reducer,

    rooms: roomSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([baseApi.middleware]),
});
