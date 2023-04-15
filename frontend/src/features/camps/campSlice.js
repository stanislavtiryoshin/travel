import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import campService from "./campService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  camps: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filteredHotels: [],
  filterType: null,
};

// Get all camps

export const getCamps = createAsyncThunk(
  "camps/getAll",
  async (_, thunkAPI) => {
    try {
      return await campService.getCamps();
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

export const campSlice = createSlice({
  name: "camp",
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
      state.camps.sort((a, b) => {
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
      state.camps.sort((a, b) => {
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
    builder.addCase(getCamps.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.camps = action.payload;
    });
  },
});

export const {
  reset,
  setFilterData,
  clearFilterData,
  sortAlphAsc,
  sortAlphDesc,
} = campSlice.actions;
export default campSlice.reducer;
