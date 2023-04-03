import { configureStore } from "@reduxjs/toolkit";

import hotelReducer from "../features/hotel/hotelSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";
import clientReducer from "../features/clientSlice";
import excursionReducer from "../features/excursion/excursionSlice";
import adminReducer from "../features/adminSlice";
import roomSlice from "../features/room/roomSlice";

import { baseApi } from "../features/services/base.service";
import { editApi } from "../features/services/edit.service";
import { csvApi } from "../features/services/csv.service";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    orders: orderReducer,
    client: clientReducer,
    excursions: excursionReducer,
    admin: adminReducer,
    [csvApi.reducerPath]: csvApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [editApi.reducerPath]: editApi.reducer,
    rooms: roomSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      baseApi.middleware,
      editApi.middleware,
      csvApi.middleware,
    ]),
});
