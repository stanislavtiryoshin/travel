import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourService from "./tourService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  tours: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
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
  },
  extraReducers: (builder) => {
    builder.addCase(getTours.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.tours = action.payload;
    });
  },
});

export const { reset } = tourSlice.actions;
export default tourSlice.reducer;
