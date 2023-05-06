import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refetch: () => {},
};

const searchSlice = createSlice({
  name: "Search",
  initialState,
  reducers: {
    setRefetch: (state, action) => {
      state.refetch = action.payload;
    },
  },
});
export const { setRefetch } = searchSlice.actions;
export default searchSlice.reducer;
