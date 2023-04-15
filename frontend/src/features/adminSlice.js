import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
  currentTab: 0,
  newHotelData: {},
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initialStateValues,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setNewHotelData: (state, action) => {
      state.newHotelData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentTab, setNewHotelData } = adminSlice.actions;

export default adminSlice.reducer;
