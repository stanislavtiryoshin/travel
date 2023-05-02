import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const priceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://easy-plum-panther-tam.cyclic.app/api",
  }),
  tagTypes: ["hotelPrice"],
  endpoints: (builder) => ({
    getHotelPrice: builder.query({
      query: (body) => ({
        url: `/hotels/price?hotelId${
          body.hotelId !== "" && body.hotelId
        }&agesArray=${body.agesArray !== "" && body.agesArray}&start=${
          body.start
        }&hotelId=${body.hotelId}&roomId=${
          body.roomId !== "" && body.roomId
        }&addExtraFood=${
          body.addExtraFood !== false && body.addExtraFood
        }&addRoomFood=${
          body.addRoomFood !== false && body.addRoomFood
        }&daysAmount=${
          body.daysAmount !== "" && body.daysAmount
        }&kidsFoodAmount=${
          body.kidsFoodAmount !== "" && body.kidsFoodAmount
        }&adultsFoodAmount=${
          body.adultsFoodAmount !== "" && body.adultsFoodAmount
        }&excursionsArray=${body.excursionsArray}`,
      }),
      providesTags: ["hotelPrice"],
    }),
  }),
});

export const { useGetHotelPriceQuery, useLazyGetHotelPriceQuery } = priceApi;
