import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelService from "./hotelService";

const initialState = {
  hotels: [],
  singleHotel: {},
  filterData: {
    filterRating: [],
    filterMaxPrice: null,
    filterMinPrice: null,
    filterFood: [],
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filteredHotels: [], // JSON array of hotels filtered by type
  filterType: null, // type of filter applied to hotels, null if no filter applied
  currentHotel: {},
};

// Add hotel

export const addHotel = createAsyncThunk(
  "hotels/add",
  async (hotelData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      return await hotelService.addHotel(hotelData, token);
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

// Update hotel

export const updateHotel = createAsyncThunk(
  "hotels/update",
  async (hotelData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await hotelService.updateHotel(hotelData, token);
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

// Get all hotels

export const getHotels = createAsyncThunk(
  "hotels/getAll",
  async (_, thunkAPI) => {
    try {
      return await hotelService.getHotels();
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

// Get searched hotels

export const getSearchedHotels = createAsyncThunk(
  "hotels/getSearched",
  async (searchData, thunkAPI) => {
    try {
      return await hotelService.getSearchedHotels(
        searchData.locationId,
        searchData.peopleAmount,
        searchData.daysAmount,
        searchData.startDate
      );
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

// Get single hotel

export const getSingleHotel = createAsyncThunk(
  "hotels/getSingle",
  async (hotelId, thunkAPI) => {
    try {
      return await hotelService.getSingleHotel(hotelId);
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

// Get all admin hotels

export const getAdminHotels = createAsyncThunk(
  "hotels/getAdminHotels",
  async (searchData, thunkAPI) => {
    try {
      return await hotelService.getAdminHotels(
        searchData.name,
        searchData.minAge,
        searchData.locationId
      );
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

export const hotelSlice = createSlice({
  name: "hotel",
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels.push(action.payload);
        state.currentHotel = action.payload;
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
      })
      .addCase(getSearchedHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
      })
      .addCase(getSingleHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleHotel = action.payload;
      })
      .addCase(getAdminHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleHotel = action.payload;
      });
  },
});

export const selectHotels = (state) => {
  const { filterMaxPrice, filterMinPrice, filterFood, filterRating } =
    state.hotels.filterData;

  // Filter the hotels array based on the filter data
  let filteredHotels = state.hotels.hotels;
  if (filterMaxPrice) {
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.totalPrice <= filterMaxPrice
    );
  }
  if (filterMinPrice) {
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.totalPrice >= filterMinPrice
    );
  }
  if (filterFood && filterFood.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return hotel.food.some((el) => filterFood.includes(el.foodId.foodName));
    });
  }
  // if (filterRating) {
  //   filteredHotels = filteredHotels.filter(
  //     (hotel) => hotel.rating === filterRating
  //   );
  // }

  return filteredHotels;
};

export const { reset, setFilterData, clearFilterData } = hotelSlice.actions;
export default hotelSlice.reducer;
