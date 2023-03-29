import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
  startDate: new Date(),
  endDate: new Date(Date.now() + 3600 * 1000 * 24),
  peopleAmount: 1,
  daysAmount: 2,
  destination: "64188de62648843412b12980",
  clientExcursions: [],
  excSum: 0,
};

export const clientSlice = createSlice({
  name: "client",
  initialState: initialStateValues,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setPeopleAmount: (state, action) => {
      state.peopleAmount = action.payload;
    },
    setDaysAmount: (state, action) => {
      state.daysAmount = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    addClientExcursion: (state, action) => {
      state.clientExcursions = [...state.clientExcursions, action.payload];
    },
    removeClientExcursion: (state, action) => {
      state.clientExcursions = state.clientExcursions.filter(
        (excId) => excId != action.payload
      );
    },
    addExcSum: (state, action) => {
      state.excSum += action.payload;
    },
    removeExcSum: (state, action) => {
      state.excSum -= action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setStartDate,
  setEndDate,
  setPeopleAmount,
  setDaysAmount,
  setDestination,
  addClientExcursion,
  removeClientExcursion,
  addExcSum,
  removeExcSum,
  setFilterFood,
  setFilterMinPrice,
  setFilterMaxPrice,
  setFilterRating,
} = clientSlice.actions;

export default clientSlice.reducer;
