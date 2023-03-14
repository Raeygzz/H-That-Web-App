import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// userAccountDeleteApi
export const userAccountDeleteApi = createAsyncThunk(
  "auth/userAccountDeleteApi",
  async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const response = await api.userAccountDelete(id);
      // console.log("userAccountDeleteApi response ==> ", response);
      const { data, status } = response;
      // console.log("userAccountDeleteApi res ==> ", data, status);

      if (status === 200) {
        localStorage.clear();
        dispatch(resetStore());

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      dispatch(hideLoader());

      let modalConfig = {
        title: "Oops!!",
        message: error.response.data.message,
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

// initial state
const initialState = {
  externalPathname: "",
  user: "",
  accessToken: "",
  isAuthenticated: false,
};

// AuthSlice
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setExternalPathname action
    setExternalPathname: (state, { payload }) => {
      state.externalPathname = payload;
    },

    // setUser action
    setUser: (state, { payload }) => {
      state.user = payload;
    },

    // setToken action
    setToken: (state, { payload }) => {
      state.accessToken = payload;
      state.isAuthenticated = true;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.externalPathname = "";
      state.user = "";
      state.accessToken = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: {
    // userAccountDeleteApi
    [userAccountDeleteApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [userAccountDeleteApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [userAccountDeleteApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { setExternalPathname, setUser, setToken, resetStore } =
  AuthSlice.actions;

export default AuthSlice.reducer;
