import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import { setError } from "./ErrorSlice";
// import { setSuccess } from "./SuccessSlice";
import { setUser, setToken } from "./AuthSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// // fetchAsyncLoginApi method with unwrapResult
// export const fetchAsyncLoginApi = createAsyncThunk(
//   "login/fetchAsyncLoginApi",
//   async (obj, { dispatch, getState }) => {
//     const response = await api.login(obj);

//     if (response.data.code === 200) {
//       // console.log("response ==> ", response);

//       return response.data;
//     }
//   }
// );

// fetchAsyncLoginApi
export const fetchAsyncLoginApi = createAsyncThunk(
  "login/fetchAsyncLoginApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      let reqData = {
        email: obj.email,
        password: obj.password,
      };

      const { data } = await api.login(reqData);

      if (data.code === 200) {
        // console.log("data ==> ", data);

        // let successConfig = {
        //   successMessage: data.message,
        //   showSuccess: true,
        // };
        // dispatch(setSuccess(successConfig));

        toast.success("Sign in successfully!");

        localStorage.setItem("accessToken", data.data.access_token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("loginWith", data.data.user.login_with);
        localStorage.setItem("userId", JSON.stringify(data.data.user.id));

        dispatch(setUser(data.data.user));
        dispatch(setToken(data.data.access_token));
        dispatch(hideLoader());

        // return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log("error.response.data ==> ", error.response.data);
        // console.log("error.response.status ==> ", error.response.status);
        // console.log("error.response.headers ==> ", error.response.headers);

        if (error.response.status === 400) {
          dispatch(hideLoader());

          let errorConfig = {
            errorMessage:
              "Sorry the email or password you entered is incorrect.",
            showError: true,
          };

          dispatch(setError(errorConfig));
        }

        if (error.response.status === 422) {
        }
      }
      // else if (error.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in node.js
      //   console.log("error.request ==> ", error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log("else error ==> ", error.message);
      // }
    }
  }
);

// initial state
const initialState = {};

// LoginSlice
const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {},
  },
  extraReducers: {
    // fetchAsyncLoginApi
    [fetchAsyncLoginApi.pending]: (state, { payload }) => {
      console.log("pending");
    },
    [fetchAsyncLoginApi.fulfilled]: (state, { payload }) => {
      console.log("fulfilled");
    },
    [fetchAsyncLoginApi.rejected]: (state, { payload }) => {
      console.log("rejected");
    },
    // // fetchAsyncLoginApi.rejected method with unwrappedResult
    // [fetchAsyncLoginApi.rejected]: (state, { error }) => {
    //   console.log("rejected error ==> ", error);
    //   state.loading = false;
    // },
  },
});

// export const { resetStore } = LoginSlice.actions;

export default LoginSlice.reducer;
