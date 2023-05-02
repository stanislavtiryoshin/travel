import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://easy-plum-panther-tam.cyclic.app/api",
    credentials: "include",
  }),
  tagTypes: ["image"],
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (body) => {
        return {
          url: `/${body.name}/${body.id}/upload`,
          body: body.formData,

          method: "PATCH",
        };
      },

      invalidatesTags: [{ id: "LIST", type: "image" }],
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
