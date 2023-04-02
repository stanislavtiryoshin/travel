import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roomService from "./roomService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  rooms: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Add room

export const addRoom = createAsyncThunk(
  "rooms/add",
  async (roomData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await roomService.addRoom(roomData, token);
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

export const roomSlice = createSlice({
  name: "room",
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
    builder.addCase(addRoom.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.rooms.push(action.payload);
    });
  },
});

export const { reset } = roomSlice.actions;
export default roomSlice.reducer;
