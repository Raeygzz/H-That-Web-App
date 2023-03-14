import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// getStripeBalanceApi
export const getStripeBalanceApi = createAsyncThunk(
  "payment/getStripeBalanceApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getStripeBalance();
      // console.log("getStripeBalanceApi response ==> ", response);
      const { data, status } = response;
      // console.log("getStripeBalanceApi res ==> ", data, status);

      if (status === 200) {
        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // let modalConfig = {
      //   title: "Oops",
      //   message: "Some thing went wrong. Please try again!",
      // };

      // dispatch(presentModal(modalConfig));

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

// getStripeConnectApi
export const getStripeConnectApi = createAsyncThunk(
  "payment/getStripeConnectApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getStripeConnect(obj);
      // console.log("getStripeConnectApi response ==> ", response);
      const { data, status } = response;
      // console.log("getStripeConnectApi res ==> ", data, status);

      if (status === 200) {
        return data.data.redirect_url;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // let modalConfig = {
      //   title: "Oops!",
      //   message:
      //     "There was a problem on stripe connect onboarding. Please try again.",
      // };
      // dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// hireItemPaymentApi
export const hireItemPaymentApi = createAsyncThunk(
  "hire/hireItemPaymentApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, name, daysDuration, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.hireItemPayment(remObj);
      // console.log("hireItemPaymentApi response ==> ", response);
      const { data, status } = response;
      // console.log("hireItemPaymentApi res ==> ", data, status);

      if (status === 200) {
        let state = {
          name: name,
          daysDuration: daysDuration,
        };

        navigate("/payment-confirmation", { state: state, replace: true });

        dispatch(hideLoader());

        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Sorry!",
        message: error.response.data.message,
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  stripeBalance: { available_balance: 0, pending_balance: 0 },
  stripeConnectOrLoginStatus: false,
  redirectUrl: "",
  hireItemStripeCostDetail: {},
};

// PaymentSlice
const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {
      state.stripeBalance = { available_balance: 0, pending_balance: 0 };
      state.stripeConnectOrLoginStatus = false;
      state.redirectUrl = "";
      state.hireItemStripeCostDetail = {};
    },
  },
  extraReducers: {
    // getStripeBalanceApi
    [getStripeBalanceApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getStripeBalanceApi.fulfilled]: (state, { payload }) => {
      state.stripeBalance = payload;
    },
    [getStripeBalanceApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // getStripeConnectApi
    [getStripeConnectApi.pending]: (state, { payload }) => {
      state.stripeConnectOrLoginStatus = true;
    },
    [getStripeConnectApi.fulfilled]: (state, { payload }) => {
      state.stripeConnectOrLoginStatus = false;
      state.redirectUrl = payload;
    },
    [getStripeConnectApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // hireItemPaymentApi
    [hireItemPaymentApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [hireItemPaymentApi.fulfilled]: (state, { payload }) => {
      state.hireItemStripeCostDetail = payload;
    },
    [hireItemPaymentApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = PaymentSlice.actions;

export default PaymentSlice.reducer;
