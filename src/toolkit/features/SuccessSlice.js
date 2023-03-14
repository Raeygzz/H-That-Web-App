import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  successMessage: "",
  showSuccess: false,
};

// SuccessSlice
const SuccessSlice = createSlice({
  name: "success",
  initialState,
  reducers: {
    // setSuccess action
    setSuccess: (state, { payload }) => {
      state.successMessage = payload.successMessage;
      state.showSuccess = payload.showSuccess;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.successMessage = "";
      state.showSuccess = false;
    },
  },
});

export const { setSuccess, resetStore } = SuccessSlice.actions;

export default SuccessSlice.reducer;
