import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { presentModal } from "./ModalSlice";

import * as api from "../../services/axios/Api";

// categoriesApi
export const categoriesApi = createAsyncThunk(
  "categories/categoriesApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.categories();
      // console.log("categoriesApi response ==> ", response);
      const { data, status } = response;
      // console.log("categoriesApi res ==> ", data, status);

      if (status === 200) {
        let categoriesPickerList = [];
        let categoriesHirePickerList = [];
        let categoriesSalePickerList = [];
        let categoriesForBothPickerList = [];
        // let filterSearchCategoriesPickerList = [];
        for (let i = 0; i < data.data.length; i++) {
          // categoriesHirePickerList
          if (data.data[i].is_for_hire === 1) {
            categoriesHirePickerList.push({
              id: data.data[i].id.toString(),
              label: data.data[i].name,
              value: data.data[i].id.toString(),
            });
          }

          // categoriesSalePickerList
          if (data.data[i].is_for_sale === 1) {
            categoriesSalePickerList.push({
              id: data.data[i].id.toString(),
              label: data.data[i].name,
              value: data.data[i].id.toString(),
            });
          }

          // categoriesForBothPickerList
          if (
            data.data[i].is_for_hire === 1 &&
            data.data[i].is_for_sale === 1
          ) {
            categoriesForBothPickerList.push({
              id: data.data[i].id.toString(),
              label: data.data[i].name,
              value: data.data[i].id.toString(),
            });
          }

          // categoriesPickerList
          categoriesPickerList.push({
            id: data.data[i].id.toString(),
            label: data.data[i].name,
            value: data.data[i].id.toString(),
          });

          // filterSearchCategoriesPickerList
          // filterSearchCategoriesPickerList.push({
          //   id: data.data[i].id.toString(),
          //   label: data.data[i].name,
          //   value: data.data[i].id.toString(),
          // });
        }

        categoriesHirePickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        categoriesSalePickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        categoriesForBothPickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        categoriesPickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        let categoriesResData = {
          data: data.data,
          categoriesPickerList: categoriesPickerList,
          categoriesHirePickerList: categoriesHirePickerList,
          categoriesSalePickerList: categoriesSalePickerList,
          categoriesForBothPickerList: categoriesForBothPickerList,
          // filterSearchCategoriesPickerList: filterSearchCategoriesPickerList,
        };

        return categoriesResData;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: '"Some thing went wrong. Please try again!"',
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// subCategoriesApi
export const subCategoriesApi = createAsyncThunk(
  "categories/subCategoriesApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      // dispatch(presentLoader());

      const response = await api.subCategories(obj);
      // console.log("subCategoriesApi response ==> ", response);
      const { data, status } = response;
      // console.log("subCategoriesApi res ==> ", data, status);

      if (status === 200) {
        let subCategoriesPickerList = [];
        // let filterSearchSubCategoriesPickerList = [];
        for (let i = 0; i < data.data.length; i++) {
          // subCategoriesPickerList
          subCategoriesPickerList.push({
            id: data.data[i].id.toString(),
            label: data.data[i].name,
            value: data.data[i].id.toString(),
          });

          // filterSearchSubCategoriesPickerList
          // filterSearchSubCategoriesPickerList.push({
          //   id: data.data[i].id.toString(),
          //   label: data.data[i].name,
          //   value: data.data[i].id.toString(),
          // });
        }

        subCategoriesPickerList.unshift({
          id: "-1",
          label: "--Select--",
          value: "",
        });

        let subCategoriesResData = {
          data: data.data,
          subCategoriesPickerList: subCategoriesPickerList,
          // filterSearchSubCategoriesPickerList:
          //   filterSearchSubCategoriesPickerList,
        };

        return subCategoriesResData;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: '"Some thing went wrong. Please try again!"',
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  categoriesFetchSuccess: false,
  categoriesList: [],
  categoriesPickerList: [],
  categoriesHirePickerList: [],
  categoriesSalePickerList: [],
  categoriesForBothPickerList: [],
  // filterSearchCategoriesPickerList: [],
  subCategoriesList: [],
  subCategoriesPickerList: [],
  // filterSearchSubCategoriesPickerList: [],
};

// CategoriesSlice
const CategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // categoriesListSuccess
    categoriesListSuccess: (state, { payload }) => {
      state.categoriesFetchSuccess = false;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.categoriesFetchSuccess = false;
      state.categoriesList = [];
      state.categoriesPickerList = [];
      state.categoriesHirePickerList = [];
      state.categoriesSalePickerList = [];
      state.categoriesForBothPickerList = [];
      // state.filterSearchCategoriesPickerList = [];
      state.subCategoriesList = [];
      state.subCategoriesPickerList = [];
      // state.filterSearchSubCategoriesPickerList = [];
    },
  },
  extraReducers: {
    // categoriesApi
    [categoriesApi.pending]: (state, { payload }) => {
      // console.log("pending");
      state.categoriesFetchSuccess = false;
    },
    [categoriesApi.fulfilled]: (state, { payload }) => {
      // console.log("categoriesApi fulfilled ==> ", payload);
      state.categoriesFetchSuccess = true;

      state.categoriesList = payload.data.length > 0 ? payload.data : [];

      state.categoriesPickerList =
        payload.categoriesPickerList.length > 0
          ? payload.categoriesPickerList
          : [];

      state.categoriesHirePickerList =
        payload.categoriesHirePickerList.length > 0
          ? payload.categoriesHirePickerList
          : [];

      state.categoriesSalePickerList =
        payload.categoriesSalePickerList.length > 0
          ? payload.categoriesSalePickerList
          : [];

      state.categoriesForBothPickerList =
        payload.categoriesForBothPickerList.length > 0
          ? payload.categoriesForBothPickerList
          : [];

      // state.filterSearchCategoriesPickerList =
      //   payload.filterSearchCategoriesPickerList.length > 0
      //     ? payload.filterSearchCategoriesPickerList
      //     : [];
    },
    [categoriesApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
      state.categoriesFetchSuccess = false;
    },

    // subCategoriesApi
    [subCategoriesApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [subCategoriesApi.fulfilled]: (state, { payload }) => {
      // console.log("subCategoriesApi fulfilled ==> ", payload);
      state.subCategoriesList = payload.data.length > 0 ? payload.data : [];

      state.subCategoriesPickerList =
        payload.subCategoriesPickerList.length > 0
          ? payload.subCategoriesPickerList
          : [];

      // state.filterSearchSubCategoriesPickerList =
      //   payload.filterSearchSubCategoriesPickerList.length > 0
      //     ? payload.filterSearchSubCategoriesPickerList
      //     : [];
    },
    [subCategoriesApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { categoriesListSuccess, resetStore } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;
