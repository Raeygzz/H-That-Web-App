import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setUser } from "./AuthSlice";
import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// getUserBusinessProfileApi
export const getUserBusinessProfileApi = createAsyncThunk(
  "tradingAccount/getUserBusinessProfileApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.userBusinessProfile("get");
      // console.log("getUserBusinessProfileApi response ==> ", response);
      const { data, status } = response;
      // console.log("getUserBusinessProfileApi res ==> ", data, status);

      if (status === 200) {
        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message: "Some thing went wrong. Please try again!",
      };

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

// updateUserBusinessProfileApi
export const updateUserBusinessProfileApi = createAsyncThunk(
  "tradingAccount/updateUserBusinessProfileApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.userBusinessProfile(remObj, "post");
      // console.log("updateUserBusinessProfileApi response ==> ", response);
      const { data, status } = response;
      // console.log("updateUserBusinessProfileApi res ==> ", data, status);

      if (status === 200) {
        let { user } = getState().auth;

        let userData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          login_with: user.login_with,
          completed_stripe_onboarding: user.completed_stripe_onboarding,
          has_primary_card: user.has_primary_card,
          has_primary_address: user.has_primary_address,
          has_business_profile: 1,
        };

        dispatch(setUser(userData));

        localStorage.setItem("user", JSON.stringify(userData));

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message: "Some thing went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  businessProfileDetails: [],
};

// TradingAccountSlice
const TradingAccountSlice = createSlice({
  name: "tradingAccount",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {
      state.businessProfileDetails = [];
    },
  },
  extraReducers: {
    // getUserBusinessProfileApi
    [getUserBusinessProfileApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getUserBusinessProfileApi.fulfilled]: (state, { payload }) => {
      state.businessProfileDetails = payload;
    },
    [getUserBusinessProfileApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // updateUserBusinessProfileApi
    [updateUserBusinessProfileApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [updateUserBusinessProfileApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [updateUserBusinessProfileApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = TradingAccountSlice.actions;

export default TradingAccountSlice.reducer;
