import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL_BASE, API_URL_PROXY } from "../../config/config";

export const filterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL_PROXY}`,
    credentials: "include",
  }),
  tagTypes: ["Filter"],
  endpoints: (builder) => ({
    getTourByFilter: builder.query({
      query: (filter) => ({
        url: `/tour/searched?locationId=${
          filter.locationId && filter.locationId
        }&duration=${filter.duration && filter.duration}&rating=${
          filter.rating && filter.rating
        }&food=${filter.food && filter.food}&paymentType=${
          filter.paymentType && filter.paymentType
        }&start=${filter.start && filter.start}&adultsAmount=${
          filter.adultsAmount && filter.adultsAmount
        }&kidsAmount=${filter.kidsAmount && filter.kidsAmount}`,
      }),
      providesTags: [{ type: "Filter", id: "LIST" }],
    }),
  }),
});

export const { useGetTourByFilterQuery, useLazyGetTourByFilterQuery } =
  filterApi;
