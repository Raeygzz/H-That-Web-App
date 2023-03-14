import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  event: {},
  presentHiringInModal: false,
  presentHiringOutModal: false,
};

// BigCalendarSlice
const BigCalendarSlice = createSlice({
  name: "bigCalendar",
  initialState,
  reducers: {
    // showHiringInModal action
    showHiringInModal: (state, { payload }) => {
      state.event = payload;
      state.presentHiringInModal = true;
    },

    // hideHiringInModal action
    hideHiringInModal: (state, { payload }) => {
      state.event = {};
      state.presentHiringInModal = false;
    },

    // showHiringOutModal action
    showHiringOutModal: (state, { payload }) => {
      state.event = payload;
      state.presentHiringOutModal = true;
    },

    // hideHiringOutModal action
    hideHiringOutModal: (state, { payload }) => {
      state.event = {};
      state.presentHiringOutModal = false;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.event = {};
      state.presentHiringInModal = false;
      state.presentHiringOutModal = false;
    },
  },
});

export const {
  showHiringInModal,
  hideHiringInModal,
  showHiringOutModal,
  hideHiringOutModal,
  resetStore,
} = BigCalendarSlice.actions;

export default BigCalendarSlice.reducer;
