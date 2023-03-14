import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setUser } from "./AuthSlice";
import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// getUserDetailApi
export const getUserDetailApi = createAsyncThunk(
  "userDetail/getUserDetailApi",
  async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getUserDetail(id);
      // console.log("getUserDetailApi response ==> ", response);
      const { data, status } = response;
      // console.log("getUserDetailApi res ==> ", data, status);

      if (status === 200) {
        dispatch(setUser(data.data));
        localStorage.setItem("user", JSON.stringify(data.data));
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
      //   if (error.response.status === 400) {
      //     dispatch(hideLoader());
      //   }

      //   // 422
      //   if (error.response.status === 422) {
      //     dispatch(hideLoader());
      //   }
      // }
    }
  }
);

// putUserDetailApi
export const putUserDetailApi = createAsyncThunk(
  "userDetail/putUserDetailApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { userInfo, navigate, id, ...remObj } = obj;

    try {
      const response = await api.putUserDetail(id, remObj);
      // console.log("putUserDetailApi response ==> ", response);
      const { data, status } = response;
      // console.log("putUserDetailApi res ==> ", data, status);

      if (status === 200) {
        let { user } = getState().auth;

        let userData = {
          id: user.id,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          login_with: user.login_with,
          completed_stripe_onboarding: user.completed_stripe_onboarding,
          has_primary_card: user.has_primary_card,
          has_primary_address: user.has_primary_address,
          has_business_profile: user.has_business_profile,
        };

        dispatch(setUser(userData));

        localStorage.setItem("user", JSON.stringify(userData));

        navigate(-1);
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let emailError = error?.response?.data?.errors?.email[0];
      // console.log('emailError ==> ', emailError);

      let userDetailUpdateError =
        emailError != undefined && emailError != null
          ? emailError
          : "Something went wrong while updating user detail. Please try again";

      let modalConfig = {
        title: "Oops",
        message: userDetailUpdateError,
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  email: "",
  cc_emails: "",
  first_name: "",
  last_name: "",
  completedStripeOnboarding: 0,
  presentUserDetailScreenModal: false,
};

// UserDetailSlice
const UserDetailSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {},
  },
  extraReducers: {
    // getUserDetailApi
    [getUserDetailApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getUserDetailApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [getUserDetailApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // putUserDetailApi
    [putUserDetailApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [putUserDetailApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [putUserDetailApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = UserDetailSlice.actions;

export default UserDetailSlice.reducer;
