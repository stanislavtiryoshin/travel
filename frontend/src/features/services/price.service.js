import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const priceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),
  tagTypes: ["hotelPrice"],
  endpoints: (builder) => ({
    getHotelPrice: builder.query({
      query: (body) => ({
        url: `/hotels/price?agesArray=${
          body.agesArray !== "" && body.agesArray
        }&start=${body.start}&hotelId=${body.hotelId}&roomId=${
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
    getSanatoriumPrice: builder.query({
      query: (body) => ({
        url: `/sanatoriums/price?agesArray=${
          body.agesArray !== "" && body.agesArray
        }&start=${body.start}&sanatoriumId=${body.sanatoriumId}&roomId=${
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
    }),
  }),
});

export const {
  useGetHotelPriceQuery,
  useLazyGetHotelPriceQuery,
  useGetSanatoriumPriceQuery,
  useLazyGetSanatoriumPriceQuery,
} = priceApi;
