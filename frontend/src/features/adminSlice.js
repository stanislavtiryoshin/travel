import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
  currentTab: 0,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initialStateValues,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentTab } = adminSlice.actions;

export default adminSlice.reducer;
