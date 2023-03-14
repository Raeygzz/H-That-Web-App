import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// sendEmailApi
export const sendEmailApi = createAsyncThunk(
  "buy/sendEmailApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.sendEmail(remObj);
      // console.log("sendEmailApi response ==> ", response);
      const { data, status } = response;
      // console.log("sendEmailApi res ==> ", data, status);

      if (status === 200) {
        navigate("/my-account/account-overview");

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message:
          "There was a problem while sending email for item enquiry. Please try again.",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();

      // if (error.response) {
      //   // 400
      //   if (error.response.status === 400) {}

      //   // 422
      //   if (error.response.status === 422) {}
      // }
    }
  }
);

// initial state
const initialState = {};

// BuySlice
const BuySlice = createSlice({
  name: "buy",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {},
  },
  extraReducers: {
    // sendEmailApi
    [sendEmailApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [sendEmailApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [sendEmailApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = BuySlice.actions;

export default BuySlice.reducer;
