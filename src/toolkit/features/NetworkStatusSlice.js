import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  since: new Date().toString(),
  onlineStatus: navigator.onLine,
};

// NetworkStatusSlice
const NetworkStatusSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    // networkStatus action
    networkStatus: (state, { payload }) => {
      state.since = payload.since;
      state.onlineStatus = payload.onlineStatus;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.since = undefined;
      state.onlineStatus = true;
    },
  },
});

export const { networkStatus, resetStore } = NetworkStatusSlice.actions;

export default NetworkStatusSlice.reducer;
