import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourService from "./tourService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  tours: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filteredTours: [],
  filterType: null,
  filterData: {
    filterRating: [],
    filterMaxPrice: null,
    filterMinPrice: null,
    filterFood: [],
    filterStars: null,
  },
};

// Get all tours

export const getTours = createAsyncThunk(
  "tours/getAll",
  async (_, thunkAPI) => {
    try {
      return await tourService.getTours();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    clearFilterData: (state) => {
      state.filterData = {
        filterMaxPrice: null,
        filterMinPrice: null,
        filterFood: [],
        filterRating: null,
      };
    },
    sortAlphAsc: (state) => {
      state.tours.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    sortAlphDesc: (state) => {
      state.tours.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTours.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.tours = action.payload;
    });
  },
});

export const selectTours = (state) => {
  const {
    filterMaxPrice,
    filterMinPrice,
    filterFood,
    filterRating,
    filterStars,
  } = state.tour.filterData;

  let filteredTours = state.tour.tours;

  // Filter the hotels array based on the filter data

  // if (filterMaxPrice) {
  //   filteredHotels = filteredHotels.filter(
  //     (hotel) => hotel.totalPrice <= filterMaxPrice
  //   );
  // }
  // if (filterMinPrice) {
  //   filteredHotels = filteredHotels.filter(
  //     (hotel) => hotel.totalPrice >= filterMinPrice
  //   );
  // }
  if (filterFood && filterFood.length > 0) {
    filteredTours = filteredTours.filter((tour) => {
      return tour.food.some((el) => filterFood.includes(el));
    });
  }
  return filteredTours;
};

export const {
  reset,
  setFilterData,
  clearFilterData,
  sortAlphAsc,
  sortAlphDesc,
} = tourSlice.actions;
export default tourSlice.reducer;
