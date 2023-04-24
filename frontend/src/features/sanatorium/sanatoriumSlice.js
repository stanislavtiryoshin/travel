import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sanatoriumService from "./sanatoriumService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  sanatoriums: [],
  singleSanatorium: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filteredHotels: [],
  filterType: null,
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

// Get single sanatorium by id

export const getSingleSanatorium = createAsyncThunk(
  "sanatoriums/getSingle",
  async (sanatoriumId, thunkAPI) => {
    try {
      return await sanatoriumService.getSingleSanatorium(sanatoriumId);
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
      state.sanatoriums.sort((a, b) => {
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
      state.sanatoriums.sort((a, b) => {
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
    builder.addCase(getSanatoriums.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.sanatoriums = action.payload;
    });
    builder.addCase(getSingleSanatorium.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.singleSanatorium = action.payload;
    });
  },
});

export const {
  reset,
  clearFilterData,
  setFilterData,
  sortAlphAsc,
  sortAlphDesc,
} = sanatoriumSlice.actions;
export default sanatoriumSlice.reducer;
