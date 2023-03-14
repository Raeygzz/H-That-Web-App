import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setError } from "./ErrorSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// // searchItemApi
// export const searchItemApi = createAsyncThunk(
//   "searchLanding/searchItemApi",
//   async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
//     const { page, navigate, ...remObj } = obj;

//     try {
//       dispatch(presentLoader());

//       const response = await api.searchItem(page, remObj);
//       // console.log("searchItemApi response ==> ", response);
//       const { data, status } = response;
//       // console.log("searchItemApi res ==> ", data, status);

//       if (status === 200) {
//         dispatch(hideLoader());

//         if (page === 1) {
//           navigate("/search-result", {
//             state: "search",
//           });
//         }

//         return data;
//       }
//       //
//     } catch (error) {
//       // console.log(`error.response: ==> `, error.response);

//       let errorConfig = {
//         showError: true,
//         errorMessage: "Some thing went wrong. Please try again!",
//       };

//       dispatch(hideLoader());
//       dispatch(setError(errorConfig));

//       return rejectWithValue();

//       // if (error.response) {
//       //   // 400
//       //   if (error.response.status === 400) {
//       //     dispatch(hideLoader());
//       //   }

//       //   // 422
//       //   if (error.response.status === 422) {
//       //     dispatch(hideLoader());
//       //   }
//       // }
//     }
//   }
// );

// nearMeApi
export const nearMeApi = createAsyncThunk(
  "searchLanding/nearMeApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { page, navigate, ...remObj } = obj;

    try {
      const response = await api.nearMe(page, remObj);
      // console.log("nearMeApi response ==> ", response);
      const { data, status } = response;
      // console.log("nearMeApi res ==> ", data, status);

      if (status === 200) {
        if (page === 1) {
          navigate("/search-result", {
            state: "searchNearMe",
          });
        }

        dispatch(hideLoader());

        return data;
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

      return rejectWithValue();
    }
  }
);

// filterSearchItemApi
export const filterSearchItemApi = createAsyncThunk(
  "searchLanding/filterSearchItemApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { page, navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.filterSearchItem(page, remObj);
      // console.log("filterSearchItemApi response ==> ", response);
      const { data, status } = response;
      // console.log("filterSearchItemApi res ==> ", data, status);

      if (status === 200) {
        dispatch(hideLoader());

        if (page === 1) {
          navigate("/search-result", {
            state: "filterSearch",
          });
        }

        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage: "Some thing went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  items: [],
  itemsLink: {},
  itemsMeta: {},
  loadedApiName: "",
  // searchItemApiIncPaginationEnabled: false,
  // searchItemApiDecPaginationEnabled: false,
  nearMeApiIncPaginationEnabled: false,
  nearMeApiDecPaginationEnabled: false,
  filterSearchItemApiIncPaginationEnabled: false,
  filterSearchItemApiDecPaginationEnabled: false,
};

// SearchLandingSlice
const SearchLandingSlice = createSlice({
  name: "searchLanding",
  initialState,
  reducers: {
    // resetStore action
    resetStore: (state, { payload }) => {
      state.items = [];
      state.itemsLink = {};
      state.itemsMeta = {};
      state.loadedApiName = "";
      // state.searchItemApiIncPaginationEnabled = false;
      // state.searchItemApiDecPaginationEnabled = false;
      state.nearMeApiIncPaginationEnabled = false;
      state.nearMeApiDecPaginationEnabled = false;
      state.filterSearchItemApiIncPaginationEnabled = false;
      state.filterSearchItemApiDecPaginationEnabled = false;
    },
  },
  extraReducers: {
    // // searchItemApi
    // [searchItemApi.pending]: (state, { payload }) => {
    //   // console.log("pending");
    // },
    // [searchItemApi.fulfilled]: (state, { payload }) => {
    //   // console.log("searchItemApi fulfilled ==> ", payload);
    //   // state.items = payload?.data?.length > 0 ? payload.meta.current_page === 1 ? payload.data : [...state.items, ...payload.data] : payload?.meta?.current_page === 1 ? [] : state.items;

    //   state.loadedApiName = "searchItem";

    //   state.items = payload.data ? payload.data : {};

    //   state.itemsMeta = payload.meta ? payload.meta : {};

    //   state.itemsLink = payload.links ? payload.links : {};

    //   state.searchItemApiIncPaginationEnabled =
    //     payload.meta.current_page < payload.meta.last_page ? true : false;

    //   state.searchItemApiDecPaginationEnabled =
    //     payload.meta.current_page > 1 ? true : false;

    //   state.nearMeApiIncPaginationEnabled = false;
    //   state.nearMeApiDecPaginationEnabled = false;
    //   state.filterSearchItemApiIncPaginationEnabled = false;
    //   state.filterSearchItemApiDecPaginationEnabled = false;
    // },
    // [searchItemApi.rejected]: (state, { payload }) => {
    //   // console.log("rejected");
    // },

    // nearMeApi
    [nearMeApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [nearMeApi.fulfilled]: (state, { payload }) => {
      // console.log("nearMeApi fulfilled ==> ", payload);

      return {
        ...state,

        loadedApiName: "nearMe",

        items: payload.data ? payload.data : {},

        itemsMeta: payload.meta ? payload.meta : {},

        itemsLink: payload.links ? payload.links : {},

        nearMeApiIncPaginationEnabled:
          payload.meta.current_page < payload.meta.last_page ? true : false,

        nearMeApiDecPaginationEnabled:
          payload.meta.current_page > 1 ? true : false,

        // searchItemApiIncPaginationEnabled: false,
        // searchItemApiDecPaginationEnabled: false,
        filterSearchItemApiIncPaginationEnabled: false,
        filterSearchItemApiDecPaginationEnabled: false,
      };
    },
    [nearMeApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // filterSearchItemApi
    [filterSearchItemApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [filterSearchItemApi.fulfilled]: (state, { payload }) => {
      // console.log("filterSearchItemApi fulfilled ==> ", payload);

      return {
        ...state,

        loadedApiName: "filterSearchItem",

        items: payload.data ? payload.data : {},

        itemsMeta: payload.meta ? payload.meta : {},

        itemsLink: payload.links ? payload.links : {},

        filterSearchItemApiIncPaginationEnabled:
          payload.meta.current_page < payload.meta.last_page ? true : false,

        filterSearchItemApiDecPaginationEnabled:
          payload.meta.current_page > 1 ? true : false,

        // searchItemApiIncPaginationEnabled: false,
        // searchItemApiDecPaginationEnabled: false,
        nearMeApiIncPaginationEnabled: false,
        nearMeApiDecPaginationEnabled: false,
      };
    },
    [filterSearchItemApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { resetStore } = SearchLandingSlice.actions;

export default SearchLandingSlice.reducer;
