import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setError } from "./ErrorSlice";
import { presentModal } from "./ModalSlice";
import { savedCardModal } from "./CardSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// hiringInListApi
export const hiringInListApi = createAsyncThunk(
  "hire/hiringInListApi",
  async (page, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.hiringInList(page);
      // console.log("hiringInListApi response ==> ", response);
      const { data, status } = response;
      // console.log("hiringInListApi res ==> ", data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
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

// hiringOutListApi
export const hiringOutListApi = createAsyncThunk(
  "hire/hiringOutListApi",
  async (page, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.hiringOutList(page);
      // console.log("hiringOutListApi response ==> ", response);
      const { data, status } = response;
      // console.log("hiringOutListApi res ==> ", data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Something went wrong. Please try again!",
      };

      dispatch(modalConfig(modalConfig));

      return rejectWithValue();
    }
  }
);

// hireItemByIdApi
export const hireItemByIdApi = createAsyncThunk(
  "hire/hireItemByIdApi",
  async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    // const { id, navigate, routeTo } = obj;
    try {
      dispatch(presentLoader());

      const response = await api.advertById(id);
      // console.log("hireItemByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("hireItemByIdApi res ==> ", data, status);

      if (status === 200) {
        dispatch(hideLoader());

        // navigate(`/${routeTo}`);

        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// hiringByIdApi
export const hiringByIdApi = createAsyncThunk(
  "hire/hiringByIdApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const response = await api.hiringById(obj);
      // console.log("hiringByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("hiringByIdApi res ==> ", data, status);

      if (status === 200) {
        dispatch(hideLoader());

        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// cancelHiringApi
export const cancelHiringApi = createAsyncThunk(
  "hire/cancelHiringApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { id, paramsId = "", navigate, currentRoute } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.cancelHiring(id);
      // console.log("cancelHiringApi response ==> ", response);
      const { data, status } = response;
      // console.log("cancelHiringApi res ==> ", data, status);

      if (status === 200) {
        if (currentRoute === `/view-hire/${id}/${paramsId}`) {
          dispatch(hiringInListApi(1));
          navigate(`/my-account/hiring-in`, { replace: true });
        }

        if (currentRoute === `/view-advert/${paramsId}`) {
          dispatch(hiringOutListApi(1));
          navigate(`/my-account/hiring-out`, { replace: true });
        }

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Something went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// findDistanceApi
export const findDistanceApi = createAsyncThunk(
  "hire/findDistanceApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { latitude1, longitude1, latitude2, longitude2 } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.findDistance(
        latitude1,
        longitude1,
        latitude2,
        longitude2
      );
      // console.log("findDistanceApi response ==> ", response);
      const { data, status } = response;
      // console.log("findDistanceApi res ==> ", data, status);

      if (status === 200) {
        dispatch(hideLoader());

        return data?.data?.distance;

        // let resStatus = data?.data?.status;
        // let resRowStatus = data?.data?.rows[0]?.elements[0]?.status;

        // if (resStatus === "OK" && resRowStatus === "OK") {
        //   let distance = data?.data?.rows[0]?.elements[0]?.distance?.value;
        //   let distance_miles = (distance * 0.621371192) / 1000;

        //   // console.log("DM ==> ", distance_miles.toFixed(2).toString());

        //   dispatch(hideLoader());

        //   return distance_miles.toFixed(2).toString();
        // }
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message:
          "There was a problem while fetching delivery distance. Please try again.",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// dayToPriceApi
export const dayToPriceApi = createAsyncThunk(
  "hire/dayToPriceApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      const response = await api.dayToPrice(remObj);
      // console.log("dayToPriceApi response ==> ", response);
      const { data, status } = response;
      // console.log("dayToPriceApi res ==> ", data, status);

      if (status === 200) {
        let errorConfig = {
          showError: false,
          errorMessage: "",
        };

        dispatch(setError(errorConfig));

        return data.data.price;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: error.response.data.message,
      };

      dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// itemHireApi
export const itemHireApi = createAsyncThunk(
  "hire/itemHireApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.itemHire(remObj);
      // console.log("itemHireApi response ==> ", response);
      const { data, status } = response;
      // console.log("itemHireApi res ==> ", data, status);

      if (status === 200) {
        dispatch(hideLoader());

        dispatch(savedCardModal(true));

        return data.data.item_hire_id;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let finalErrorMessage = "";

      if (error.response) {
        // 400
        if (error.response.status === 400) {
        }

        // 422
        if (error.response.status === 422) {
          let errors = error.response.data?.errors;
          let errorMessage = error.response.data?.message;

          if (errorMessage === "The Amount paid mismatched") {
            finalErrorMessage =
              "The amount paid mismatched, please try again selecting new dates";
            //
          } else if (errors?.delivery_distance[0] != "") {
            finalErrorMessage = errors?.delivery_distance[0];
            //
          } else {
            finalErrorMessage = "Something went wrong please try again";
          }
        }
      }

      let modalConfig = {
        title: "Sorry!",
        shouldRunFunction: true,
        functionHandler: "clearCalendarDatesHandler",
        message: finalErrorMessage,
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  singleHireItem: {},
  hiringInList: [],
  hiringInMeta: {},
  hiringInLinks: {},
  hiringInListIsLoading: false,
  hiringInListApiIncPaginationEnabled: false,
  hiringInListApiDecPaginationEnabled: false,
  hiringOutList: [],
  hiringOutMeta: {},
  hiringOutLinks: {},
  hiringOutListIsLoading: false,
  hiringOutListApiIncPaginationEnabled: false,
  hiringOutListApiDecPaginationEnabled: false,
  hireCalculatedDistance: "",
  numberOfDaysToPrice: "",
  itemHireId: "",
};

// HireSlice
const HireSlice = createSlice({
  name: "hire",
  initialState,
  reducers: {
    //singleHiringItem
    singleHiringItem: (state, { payload }) => {
      state.singleHireItem = payload;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.singleHireItem = {};
      state.hiringInList = [];
      state.hiringInMeta = {};
      state.hiringInLinks = {};
      state.hiringInListIsLoading = true;
      state.hiringOutList = [];
      state.hiringOutMeta = {};
      state.hiringOutLinks = {};
      state.hiringOutListIsLoading = true;
      state.hireCalculatedDistance = "";
      state.numberOfDaysToPrice = "";
      state.itemHireId = "";
      state.hiringInListApiIncPaginationEnabled = false;
      state.hiringInListApiDecPaginationEnabled = false;
      state.hiringOutListApiIncPaginationEnabled = false;
      state.hiringOutListApiDecPaginationEnabled = false;
    },
  },
  extraReducers: {
    // hiringInListApi
    [hiringInListApi.pending]: (state, { payload }) => {
      state.hiringInListIsLoading = true;
      // console.log("pending");
    },
    [hiringInListApi.fulfilled]: (state, { payload }) => {
      state.hiringInList = payload.data ? payload.data : [];

      state.hiringInMeta = payload.meta ? payload.meta : {};

      state.hiringInLinks = payload.links ? payload.links : {};

      state.hiringInListApiIncPaginationEnabled =
        payload.meta.current_page < payload.meta.last_page ? true : false;

      state.hiringInListApiDecPaginationEnabled =
        payload.meta.current_page > 1 ? true : false;

      state.hiringInListIsLoading = false;
    },
    [hiringInListApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
      state.hiringInListIsLoading = false;
    },

    // hiringOutListApi
    [hiringOutListApi.pending]: (state, { payload }) => {
      // console.log("pending");
      state.hiringOutListIsLoading = true;
    },
    [hiringOutListApi.fulfilled]: (state, { payload }) => {
      // console.log("nearMeApi fulfilled ==> ", payload);

      return {
        ...state,

        hiringOutList: payload.data ? payload.data : [],

        hiringOutMeta: payload.meta ? payload.meta : {},

        hiringOutLinks: payload.links ? payload.links : {},

        hiringOutListApiIncPaginationEnabled:
          payload.meta.current_page < payload.meta.last_page ? true : false,

        hiringOutListApiDecPaginationEnabled:
          payload.meta.current_page > 1 ? true : false,

        hiringOutListIsLoading: false,
      };
    },
    [hiringOutListApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
      state.hiringOutListIsLoading = false;
    },

    // hireItemByIdApi
    [hireItemByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [hireItemByIdApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");

      return {
        ...state,

        singleHireItem: payload.data ? payload.data : {},
      };
    },
    [hireItemByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // hiringByIdApi
    [hiringByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [hiringByIdApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");

      return {
        ...state,

        singleHireItem: payload.data ? payload.data : {},
      };
    },
    [hiringByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // cancelHiringApi
    [cancelHiringApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [cancelHiringApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [cancelHiringApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // findDistanceApi
    [findDistanceApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [findDistanceApi.fulfilled]: (state, { payload }) => {
      state.hireCalculatedDistance = payload;
    },
    [findDistanceApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // dayToPriceApi
    [dayToPriceApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [dayToPriceApi.fulfilled]: (state, { payload }) => {
      state.numberOfDaysToPrice = payload;
    },
    [dayToPriceApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // itemHireApi
    [itemHireApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [itemHireApi.fulfilled]: (state, { payload }) => {
      state.itemHireId = payload;
    },
    [itemHireApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { singleHiringItem, resetStore } = HireSlice.actions;

export default HireSlice.reducer;
