import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const filterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
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
        }`,
      }),
      providesTags: [{ type: "Filter", id: "LIST" }],
    }),
  }),
});

export const { useGetTourByFilterQuery, useLazyGetTourByFilterQuery } =
  filterApi;
