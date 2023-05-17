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
    getHotelsByFilter: builder.query({
      query: (filter) => ({
        url: `/hotels/searched?locationId=${
          filter.locationId && filter.locationId
        }&filterFood=${filter.filterFood && filter.filterFood}&filterStars=${
          filter.filterStars && filter.filterStars
        }&filterRating=${filter.filterRating && filter.filterRating}&start=${
          filter.start && filter.start
        }&adultsAmount=${
          filter.adultsAmount && filter.adultsAmount
        }&kidsAmount=${filter.kidsAmount && filter.kidsAmount}&filterServices=${
          filter.filterServices && filter.filterServices
        }&filterBathroom=${
          filter.filterBathroom && filter.filterBathroom
        }&filterExtraPlaces=${
          filter.filterExtraPlaces && filter.filterExtraPlaces
        }&daysAmount=${filter.daysAmount && filter.daysAmount}`,
      }),
      providesTags: [{ type: "Filter", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTourByFilterQuery,
  useLazyGetTourByFilterQuery,
  useGetHotelsByFilterQuery,
  useLazyGetHotelsByFilterQuery,
} = filterApi;
