import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setUser } from "./AuthSlice";
import { setError } from "./ErrorSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// addAddressApi POST
export const addAddressApi = createAsyncThunk(
  "address/addAddressApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const { data, status } = await api.createAddress(remObj);

      if (status === 200) {
        dispatch(addressListApi());

        navigate("/my-account", { replace: true });

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`address slice error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(setError(errorConfig));
    }
  }
);

// addressListApi GET
export const addressListApi = createAsyncThunk(
  "address/addressListApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    try {
      // dispatch(presentLoader());

      const { data, status } = await api.addressList();

      if (status === 200) {
        let addressPickerList = [];
        for (let i = 0; i < data.data.length; i++) {
          addressPickerList.push({
            id: data.data[i].id.toString(),
            label: data.data[i].name,
            value: data.data[i].name,
            isPrimary: data.data[i].is_primary,
            postcode: data.data[i].post_code,
            lat: data.data[i].latitude,
            lon: data.data[i].longitude,
          });
        }

        addressPickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        let addressesResponse = {
          addressList: data.data,
          addressPickerList: addressPickerList,
        };

        // dispatch(hideLoader());
        return addressesResponse;
      }
      //
    } catch (error) {
      // console.log(`address slice error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: "Some thing went wrong. Please try again!",
      };

      // dispatch(hideLoader());
      dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// onboardingAddAddressApi POST
export const onboardingAddAddressApi = createAsyncThunk(
  "address/onboardingAddAddressApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const { data, status } = await api.createAddress(remObj);

      if (status === 200) {
        dispatch(addressListApi());

        const { user } = getState().auth;

        let userData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          login_with: user.login_with,
          completed_stripe_onboarding: user.completed_stripe_onboarding,
          has_primary_card: user.has_primary_card,
          has_primary_address: 1,
          has_business_profile: user.has_business_profile,
        };

        dispatch(setUser(userData));

        localStorage.setItem("user", JSON.stringify(userData));

        dispatch(hideLoader());

        navigate("/search-landing", { replace: true });
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(setError(errorConfig));
    }
  }
);

// updateAddressApi PUT
export const updateAddressApi = createAsyncThunk(
  "address/updateAddressApi",
  async (obj, { dispatch, getState, rejectWithValue }) => {
    const { addressId, navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const { data, status } = await api.updateAddress(addressId, remObj);

      if (status === 200) {
        dispatch(addressListApi());

        navigate("/my-account", { replace: true });

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`address slice error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(setError(errorConfig));
    }
  }
);

// deleteAddressApi DELETE
export const deleteAddressApi = createAsyncThunk(
  "address/deleteAddressApi",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const { data, status } = await api.deleteAddressById(id);

      if (status === 200) {
        dispatch(addressListApi());

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: error.response.data.message,
      };

      dispatch(hideLoader());
      dispatch(setError(errorConfig));
    }
  }
);

// initial state
const initialState = {
  navigateTo: "",
  selectedNavLinks: "",
  addressOperationSuccess: false,
  addressList: [],
  addressPickerList: [],
  // addressById: [],
  // addressResponseMessage: '',
  // presentAddressScreenModal: false,
};

// AddressSlice
const AddressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // routeTo
    routeTo: (state, { payload }) => {
      state.navigateTo = payload;
    },

    // setSelectedNavLinks
    setSelectedNavLinks: (state, { payload }) => {
      state.selectedNavLinks = payload;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.navigateTo = "";
      state.selectedNavLinks = "";
      state.addressOperationSuccess = false;
      state.addressList = [];
      state.addressPickerList = [];
    },
  },
  extraReducers: {
    // addAddressApi
    [addAddressApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [addAddressApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [addAddressApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // updateAddressApi
    [updateAddressApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [updateAddressApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [updateAddressApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // addressListApi
    [addressListApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [addressListApi.fulfilled]: (state, { payload }) => {
      state.addressList = payload.addressList;
      state.addressPickerList = payload.addressPickerList;
    },
    [addressListApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // onboardingAddAddressApi
    [onboardingAddAddressApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [onboardingAddAddressApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [onboardingAddAddressApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // deleteAddressApi
    [deleteAddressApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [deleteAddressApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
      state.addressOperationSuccess = true;
    },
    [deleteAddressApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
      state.addressOperationSuccess = false;
    },
  },
});

export const { routeTo, setSelectedNavLinks, resetStore } =
  AddressSlice.actions;

export default AddressSlice.reducer;
