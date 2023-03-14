import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getObjectLength } from "../../utils";

import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";

import * as api from "../../services/axios/Api";

// listUserCardsApi
export const listUserCardsApi = createAsyncThunk(
  "card/listUserCardsApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.listUserCards();
      // console.log("listUserCardsApi response ==> ", response);
      const { data, status } = response;
      // console.log("listUserCardsApi res ==> ", data, status);

      if (status === 200) {
        let finalResponse = {};
        let apiResponse = data.data;
        // console.log("apiResponse ==> ", apiResponse);

        if (apiResponse.data.length > 0) {
          let defaultCard = {};
          let filteredCardList = [];

          for (let i = 0; i < apiResponse.data.length; i++) {
            filteredCardList.push({
              id: apiResponse.data[i].id,

              defaultCard:
                apiResponse.default_card === apiResponse.data[i].id
                  ? true
                  : false,

              cardNumber: apiResponse.data[i].card.last4,

              cardBrand: apiResponse.data[i].card.brand,

              expiryMonth:
                apiResponse.data[i].card.exp_month > 9
                  ? apiResponse.data[i].card.exp_month
                  : `0${apiResponse.data[i].card.exp_month}`,

              expiryYear: apiResponse.data[i].card.exp_year,
            });
          }

          for (var i = 0; i < filteredCardList.length; i++) {
            if (filteredCardList[i].defaultCard) {
              defaultCard = filteredCardList[i];
              filteredCardList.splice(i, 1);
            }
          }

          if (getObjectLength(defaultCard).length != 0) {
            filteredCardList.unshift(defaultCard);
          }

          finalResponse = {
            filteredCardList: filteredCardList,
            cardList: data.data,
            cardDetails: {
              defaultCard: data.data.default_card,
              hasMore: data.data.has_more,
              object: data.data.object,
              url: data.data.url,
            },
          };
        }

        return finalResponse;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message: error.response.data.message,
      };

      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// defaultCardApi
export const defaultCardApi = createAsyncThunk(
  "card/defaultCardApi",
  async (cardID, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const response = await api.defaultCard(cardID);
      // console.log("defaultCardApi response ==> ", response);
      const { data, status } = response;
      // console.log("defaultCardApi res ==> ", data, status);

      if (status === 200) {
        dispatch(listUserCardsApi());

        dispatch(clearMakeDefaultCheckbox(true));

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops",
        message:
          "There was a problem while making selected card default. Please try again.",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// deleteCardApi
export const deleteCardApi = createAsyncThunk(
  "card/deleteCardApi",
  async (cardID, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const response = await api.deleteCard(cardID);
      // console.log("deleteCardApi response ==> ", response);
      const { data, status } = response;
      // console.log("deleteCardApi res ==> ", data, status);

      if (status === 200) {
        dispatch(listUserCardsApi());

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message:
          "There was a problem while deleting selected card. Please try again.",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// getClientSecretApi
export const getClientSecretApi = createAsyncThunk(
  "card/getClientSecretApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getClientSecret();
      // console.log("getClientSecretApi response ==> ", response);
      const { data, status } = response;
      // console.log("getClientSecretApi res ==> ", data, status);

      if (status === 200) {
        return data.data.client_secret;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // let modalConfig = {
      //   title: "Oops!",
      //   message:
      //     "There was a problem while fetching the client secret for Saving Card. Please try again.",
      // };
      // dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  cardList: [],
  cardDetails: {},
  filteredCardList: [],
  clientSecret: "",
  isMakeDefaultCheckboxClear: false,
  showSavedCardModal: false,
};

// CardSlice
const CardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    // clearMakeDefaultCheckbox action
    clearMakeDefaultCheckbox: (state, { payload }) => {
      state.isMakeDefaultCheckboxClear = payload;
    },

    // savedCardModal action
    savedCardModal: (state, { payload }) => {
      state.showSavedCardModal = payload;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.cardList = [];
      state.cardDetails = {};
      state.filteredCardList = [];
      state.clientSecret = "";
      state.isMakeDefaultCheckboxClear = false;
      state.showSavedCardModal = false;
    },
  },
  extraReducers: {
    // listUserCardsApi
    [listUserCardsApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [listUserCardsApi.fulfilled]: (state, { payload }) => {
      state.cardList = payload.cardList;

      state.cardDetails = payload.cardDetails;

      state.filteredCardList = payload.filteredCardList
        ? payload.filteredCardList
        : [];
    },
    [listUserCardsApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // defaultCardApi
    [defaultCardApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [defaultCardApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [defaultCardApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // deleteCardApi
    [deleteCardApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [deleteCardApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [deleteCardApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // getClientSecretApi
    [getClientSecretApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getClientSecretApi.fulfilled]: (state, { payload }) => {
      state.clientSecret = payload;
    },
    [getClientSecretApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const { clearMakeDefaultCheckbox, savedCardModal, resetStore } =
  CardSlice.actions;

export default CardSlice.reducer;
