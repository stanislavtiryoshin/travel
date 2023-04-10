import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sanatoriumService from "./sanatoriumServices";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  sanatoriums: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get all sanatoriums

export const getSanatoriums = createAsyncThunk(
  "sanatoriums/getAll",
  async (_, thunkAPI) => {
    try {
      return await sanatoriumService.getSanatoriums();
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

export const sanatoriumSlice = createSlice({
  name: "sanatorium",
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
    builder.addCase(getSanatoriums.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.sanatoriums = action.payload;
    });
  },
});

export const { reset } = sanatoriumSlice.actions;
export default sanatoriumSlice.reducer;
