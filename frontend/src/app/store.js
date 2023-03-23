import { configureStore } from "@reduxjs/toolkit";

import hotelReducer from "../features/hotel/hotelSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";
import clientReducer from "../features/clientSlice";
import excursionReducer from "../features/excursion/excursionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    orders: orderReducer,
    client: clientReducer,
    excursion: excursionReducer,
  },
});
