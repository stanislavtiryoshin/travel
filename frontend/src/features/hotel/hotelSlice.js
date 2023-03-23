import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelService from "./hotelService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  hotels: [],
  singleHotel: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filteredHotels: [], // JSON array of hotels filtered by type
  filterType: null, // type of filter applied to hotels, null if no filter applied
};

// Add hotels

export const addHotel = createAsyncThunk(
  "hotels/add",
  async (hotelData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await hotelService.addHotel(
        {
          name: hotelData.name,
          type: hotelData.type,
          location: hotelData.location,
          resort: hotelData.resort,
          price: hotelData.price,
          discount: hotelData.discount,
          description: hotelData.description,
          food: hotelData.food,
          rooms: hotelData.rooms,
        },
        token
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
  async (locationId, thunkAPI) => {
    try {
      return await hotelService.getSearchedHotels(locationId);
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
    filterByType: (state, action) => {
      const filterType = action.payload;
      const filteredHotels = state.allHotels.filter(
        (hotel) => hotel.type === filterType
      );
      return { ...state, filteredHotels, filterType };
    },
    // Action to remove the filter on hotels
    clearFilter: (state) => {
      return { ...state, filteredHotels: [], filterType: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels.push(action.payload);
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
      });
  },
});

export const { reset, filterByType, clearFilter } = hotelSlice.actions;
export default hotelSlice.reducer;
