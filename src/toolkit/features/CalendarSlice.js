import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { setError } from "./ErrorSlice";
import { presentModal } from "./ModalSlice";

import * as api from "../../services/axios/Api";

// calendarUnavailableDateListApi
export const calendarUnavailableDateListApi = createAsyncThunk(
  "calendar/calendarUnavailableDateListApi",
  async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.calendarUnavailableDateList(id);
      // console.log("calendarUnavailableDateListApi response ==> ", response);
      const { data, status } = response;
      // console.log("calendarUnavailableDateListApi res ==> ", data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // if (error.response) {
      //   // 400
      //   if (error.response.status === 400) {}

      //   // 422
      //   if (error.response.status === 422) {}
      // }

      // let errorConfig = {
      //   showError: true,
      //   errorMessage: "Some thing went wrong. Please try again!",
      // };

      // dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// calendarDatesMakingUnavailableApi POST
export const calendarDatesMakingUnavailableApi = createAsyncThunk(
  "calendar/calendarDatesMakingUnavailableApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { id, ...remObj } = obj;

    try {
      const response = await api.calendarDatesMakingUnavailable(id, remObj);
      // console.log("calendarDatesMakingUnavailableApi response ==> ", response);
      const { data, status } = response;
      // console.log("calendarDatesMakingUnavailableApi data, status ==> ", data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      return rejectWithValue();
    }
  }
);

// calendarDateDeleteByIdApi DELETE
export const calendarDateDeleteByIdApi = createAsyncThunk(
  "calendar/calendarDateDeleteByIdApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { id, ...remObj } = obj;

    try {
      const response = await api.calendarDateDeleteById(id, remObj);
      // console.log("calendarDateDeleteByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("calendarDateDeleteByIdApi data, status ==> ", data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      return rejectWithValue();
    }
  }
);

// getHireCalendarHiringApi
export const getHireCalendarHiringApi = createAsyncThunk(
  "calendar/getHireCalendarHiringApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getHireCalendarHiring();
      // console.log("getHireCalendarHiringApi response ==> ", response);
      const { data, status } = response;
      // console.log("getHireCalendarHiringApi res ==> ", data, status);

      if (status === 200) {
        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message:
          "Some thing went wrong while fetching Hire Calendar Data. Please try again!",
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// getHireCalendarHiringOutApi
export const getHireCalendarHiringOutApi = createAsyncThunk(
  "calendar/getHireCalendarHiringOutApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getHireCalendarHiringOut();
      // console.log("getHireCalendarHiringOutApi response ==> ", response);
      const { data, status } = response;
      // console.log("getHireCalendarHiringOutApi res ==> ", data, status);

      if (status === 200) {
        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message:
          "Some thing went wrong while fetching Hire Calendar Data. Please try again!",
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  calendarUnavailableDateList: [],
  hireCalendarHiring: [],
  hireCalendarHiringOut: [],
};

// CalendarSlice
const CalendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {
      state.calendarUnavailableDateList = [];
      state.hireCalendarHiring = [];
      state.hireCalendarHiringOut = [];
    },
  },
  extraReducers: {
    // calendarUnavailableDateListApi
    [calendarUnavailableDateListApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [calendarUnavailableDateListApi.fulfilled]: (state, { payload }) => {
      state.calendarUnavailableDateList = payload.data ? payload.data : [];
    },
    [calendarUnavailableDateListApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // calendarDatesMakingUnavailableApi
    [calendarDatesMakingUnavailableApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [calendarDatesMakingUnavailableApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [calendarDatesMakingUnavailableApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // calendarDateDeleteByIdApi
    [calendarDateDeleteByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [calendarDateDeleteByIdApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [calendarDateDeleteByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // getHireCalendarHiringApi
    [getHireCalendarHiringApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getHireCalendarHiringApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
      state.hireCalendarHiring = payload;
    },
    [getHireCalendarHiringApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // getHireCalendarHiringOutApi
    [getHireCalendarHiringOutApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getHireCalendarHiringOutApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
      state.hireCalendarHiringOut = payload;
    },
    [getHireCalendarHiringOutApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = CalendarSlice.actions;

export default CalendarSlice.reducer;
