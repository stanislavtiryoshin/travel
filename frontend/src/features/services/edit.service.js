import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const editApi = createApi({
  reducerPath: "editApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["Camp"],
  endpoints: (builder) => ({
    getCampById: builder.query({
      query: (id) => ({
        url: `/camps/${id}`,
      }),
      providesTags: [{ type: "Camp", id: "LIST" }],
    }),
    editCampById: builder.mutation({
      query: (body) => ({
        url: `/camps/${body.id}`,
        method: "PATCH",
        body,
        headers: {
          Authorization: `Bearer ${body.token}`,
        },
      }),
      invalidatesTags: [{ type: "Camp", id: "LIST" }],
    }),
    deleteCampById: builder.mutation({
      query: (id) => ({
        url: `/camps/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Camp", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCampByIdQuery,
  useDeleteCampByIdMutation,
  useEditCampByIdMutation,
} = editApi;
