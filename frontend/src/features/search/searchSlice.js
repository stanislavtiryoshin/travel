import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refetch: () => {},
  searchFilter: {
    locationId: "",
    daysAmount: 1,
    agesArray: [],
    start: null,
  },
};

const searchSlice = createSlice({
  name: "Search",
  initialState,
  reducers: {
    setRefetch: (state, action) => {
      state.refetch = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },
  },
});
export const { setRefetch, setSearchFilter } = searchSlice.actions;
export default searchSlice.reducer;
