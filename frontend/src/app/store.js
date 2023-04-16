import { configureStore } from "@reduxjs/toolkit";

import hotelReducer from "../features/hotel/hotelSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";
import clientReducer from "../features/clientSlice";
import excursionReducer from "../features/excursion/excursionSlice";
import adminReducer from "../features/adminSlice";
import roomSlice from "../features/room/roomSlice";
import tourReducer from "../features/tour/tourSlice";
import campReducer from "../features/camps/campSlice";
import sanatoriumReducer from "../features/sanatorium/sanatoriumSlice";

import { baseApi } from "../features/services/base.service";
import { editApi } from "../features/services/edit.service";
import { csvApi } from "../features/services/csv.service";

import { uploadApi } from "../features/services/upload.service";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    orders: orderReducer,
    client: clientReducer,
    excursions: excursionReducer,
    admin: adminReducer,
    tour: tourReducer,
    camps: campReducer,
    sanatoriums: sanatoriumReducer,
    [csvApi.reducerPath]: csvApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [editApi.reducerPath]: editApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    rooms: roomSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      baseApi.middleware,
      editApi.middleware,
      csvApi.middleware,
      uploadApi.middleware,
    ]),
});
