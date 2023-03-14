import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setError } from "./ErrorSlice";
import { setSuccess } from "./SuccessSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// fetchAsyncForgotPasswordApi
export const fetchAsyncForgotPasswordApi = createAsyncThunk(
  "forgotPassword/fetchAsyncForgotPasswordApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      let reqData = {
        email: obj.email,
      };

      const { data, status } = await api.forgotPassword(reqData);

      if (status === 200) {
        // console.log("data, status ==> ", data, status);

        let successConfig = {
          showSuccess: true,
          successMessage: data.message,
        };

        dispatch(hideLoader());
        dispatch(setSuccess(successConfig));

        // return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      if (error.response && error.response.status === 422) {
        let errorConfig = {
          showError: true,
          errorMessage: error.response.data.errors.email[0],
        };

        dispatch(hideLoader());
        dispatch(setError(errorConfig));
      }
    }
  }
);

// initial state
const initialState = {};

// ForgotPasswordSlice
const ForgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {},
  },
  extraReducers: {
    // fetchAsyncForgotPasswordApi
    [fetchAsyncForgotPasswordApi.pending]: (state, { payload }) => {
      console.log("pending");
    },
    [fetchAsyncForgotPasswordApi.fulfilled]: (state, { payload }) => {
      console.log("fulfilled");
    },
    [fetchAsyncForgotPasswordApi.rejected]: (state, { payload }) => {
      console.log("rejected");
    },
  },
});

// export const { resetStore } = ForgotPasswordSlice.actions;

export default ForgotPasswordSlice.reducer;
