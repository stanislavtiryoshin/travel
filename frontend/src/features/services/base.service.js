import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["category", "location", "Program", "hotels", "services"],
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => ({
        url: "/categories",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "category", _id })),
              { type: "category", id: "LIST" },
            ]
          : [{ type: "category", id: "LIST" }],
    }),
    getLocation: builder.query({
      query: () => ({
        url: "/locations",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "location", _id })),
              { type: "location", id: "LIST" },
            ]
          : [{ type: "location", id: "LIST" }],
    }),
    getProgram: builder.query({
      query: () => ({
        url: "/programs",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Program", _id })),
              { type: "Program", id: "LIST" },
            ]
          : [{ type: "Program", id: "LIST" }],
    }),
    getHotels: builder.query({
      query: () => ({
        url: "/hotels",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "hotels", _id })),
              { type: "hotels", id: "LIST" },
            ]
          : [{ type: "hotels", id: "LIST" }],
    }),
    getHotelService: builder.query({
      query: () => ({
        url: "/hotelServices",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "services", _id })),
              { type: "services", id: "LIST" },
            ]
          : [{ type: "services", id: "LIST" }],
    }),
    addTour: builder.mutation({
      query: (body) => ({
        url: "/tour",
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${body.token}`,
        },
      }),
      invalidatesTags: [{ id: "LIST", type: "Program" }],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetLocationQuery,
  useGetProgramQuery,
  useGetHotelsQuery,
  useGetHotelServiceQuery,
  useAddTourMutation,
} = baseApi;
