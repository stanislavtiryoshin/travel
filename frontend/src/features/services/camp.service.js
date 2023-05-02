import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/dist/query/react";

export const campApi = createApi({
  reducerPath: "campApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://easy-plum-panther-tam.cyclic.app/api",
    credentials: "include",
  }),
  tagTypes: ["Camp"],
  endpoints: (builder) => ({
    getCampById: builder.query({
      query: (id) => ({
        url: `/camps/${id}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Camp", _id })),
              { type: "Camp", id: "LIST" },
            ]
          : [{ type: "Camp", id: "LIST" }],
    }),
    getCampRecommendations: builder.mutation({
      query: (body) => ({
        url: "/camps/recommendation",
        body,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Camp", id: "LIST" }],
    }),
  }),
});

export const { useGetCampByIdQuery, useGetCampRecommendationsMutation } =
  campApi;
