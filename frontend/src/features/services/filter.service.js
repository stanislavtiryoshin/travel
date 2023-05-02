import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const filterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://easy-plum-panther-tam.cyclic.app/api",
    credentials: "include",
  }),
  tagTypes: ["Filter"],
  endpoints: (builder) => ({
    getTourByFilter: builder.query({
      query: (filter) => ({
        url: `/tour/searched/query?locationId=${
          filter.locationId && filter.locationId
        }&duration=${filter.duration && filter.duration}&rating=${
          filter.rating && filter.rating
        }&food=${filter.food && filter.food}&paymentType=${
          filter.paymentType && filter.paymentType
        }`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Filter", _id })),
              { type: "Filter", id: "LIST" },
            ]
          : [{ type: "Filter", id: "LIST" }],
    }),
  }),
});

export const { useGetTourByFilterQuery, useLazyGetTourByFilterQuery } =
  filterApi;
