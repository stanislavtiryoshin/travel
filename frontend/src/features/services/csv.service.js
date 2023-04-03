import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const csvApi = createApi({
  reducerPath: "csvApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["Csv"],
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: (id) => `/hotels/hotelRoomPrices/${id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Csv", _id })),
              { type: "Csv", id: "LIST" },
            ]
          : [{ type: "Csv", id: "LIST" }],
    }),
    uploadCsv: builder.mutation({
      query: (body) => {
        // console.log("body", body);
        return {
          url: `/hotels/${body.id}/prices`,
          method: "PATCH",
          body: body.file,
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Csv", id: "LIST" }],
    }),
  }),
});

export const { useUploadCsvMutation, useGetRoomsQuery } = csvApi;
