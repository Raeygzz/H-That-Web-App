import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import { setError } from "./ErrorSlice";
import { presentModal } from "./ModalSlice";
// import { setSuccess } from "./SuccessSlice";
import { setUser, setToken } from "./AuthSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// fetchAsyncSignupApi
export const fetchAsyncSignupApi = createAsyncThunk(
  "signup/fetchAsyncSignupApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      let reqData = {
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        password: obj.password,
        password_confirmation: obj.password_confirmation,
        accepted_terms_and_conditions: obj.accepted_terms_and_conditions,
      };

      const { data } = await api.signUp(reqData);

      if (data.code === 200) {
        // console.log("data ==> ", data);

        // let successConfig = {
        //   showSuccess: true,
        //   successMessage: data.message,
        // };
        // dispatch(setSuccess(successConfig));

        toast.success("Sign up successfully!");

        localStorage.setItem("accessToken", data.data.access_token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("loginWith", data.data.user.login_with);
        localStorage.setItem("userId", JSON.stringify(data.data.user.id));

        dispatch(setUser(data.data.user));
        dispatch(setToken(data.data.access_token));
        dispatch(hideLoader());

        let modalConfig = {
          title: "Registration Success",
          showCancelButton: false,
          message: `A welcome email has been sent to <span style="font-weight:bold;color:#ff6100">${reqData.email}</span>. Please check your inbox.`,
        };

        dispatch(presentModal(modalConfig));

        // return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      if (error.response) {
        if (error.response.status === 422) {
          dispatch(hideLoader());

          let errorConfig = {
            errorMessage: error.response.data.errors.email[0],
            showError: true,
          };

          dispatch(setError(errorConfig));
        }
      }
    }
  }
);

// initial state
const initialState = {};

// SignupSlice
const SignupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {},
  },
  extraReducers: {
    // fetchAsyncSignupApi
    [fetchAsyncSignupApi.pending]: (state, { payload }) => {
      console.log("pending");
    },
    [fetchAsyncSignupApi.fulfilled]: (state, { payload }) => {
      console.log("fulfilled");
    },
    [fetchAsyncSignupApi.rejected]: (state, { payload }) => {
      console.log("rejected");
    },
  },
});

// export const { resetStore } = SignupSlice.actions;

export default SignupSlice.reducer;
