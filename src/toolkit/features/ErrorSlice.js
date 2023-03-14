import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  errorMessage: "",
  showError: false,
};

// ErrorSlice
const ErrorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    // setError action
    setError: (state, { payload }) => {
      state.errorMessage = payload.errorMessage;
      state.showError = payload.showError;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.errorMessage = "";
      state.showError = false;
    },
  },
});

export const { setError, resetStore } = ErrorSlice.actions;

export default ErrorSlice.reducer;
