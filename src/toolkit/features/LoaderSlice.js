import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  presentLoader: false,
};

// LoaderSlice
const LoaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    // presentLoader action
    presentLoader: (state, { payload }) => {
      state.presentLoader = true;
    },

    // hideLoader action
    hideLoader: (state, { payload }) => {
      state.presentLoader = false;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.presentLoader = false;
    },
  },
});

export const { presentLoader, hideLoader, resetStore } = LoaderSlice.actions;

export default LoaderSlice.reducer;
