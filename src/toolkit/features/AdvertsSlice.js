import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { presentModal } from "./ModalSlice";
import { getObjectLength } from "../../utils";
import { presentLoader, hideLoader } from "./LoaderSlice";
import { setNumberOfImportedAdverts, setSelectedTask } from "./BulkUploadSlice";

import * as api from "../../services/axios/Api";

// createAdvertApi
export const createAdvertApi = createAsyncThunk(
  "adverts/createAdvertApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, from, advertIndex, ...remObj } = obj;

    try {
      if (from === "PostAdvert") {
        dispatch(presentLoader());
      }

      const response = await api.createAdvert(remObj);
      // console.log("createAdvertApi response ==> ", response);
      const { data, status } = response;
      // console.log("createAdvertApi res ==> ", data, status);

      if (status === 200) {
        if (from === "PostAdvert") {
          navigate("/my-account/account-overview", { replace: true });

          dispatch(hideLoader());
        }

        if (from === "BulkUpload") {
          let state = getState().bulkUpload;
          let { numberOfImportedAdverts, bulkUploadCreateAdvertList } = state;

          dispatch(setNumberOfImportedAdverts(numberOfImportedAdverts + 1));
          dispatch(setCreateAdvertIsLoadingComplete(false));

          if (bulkUploadCreateAdvertList.length < 1) {
            dispatch(setSelectedTask("complete"));
          }
        }
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

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

      if (from === "PostAdvert") {
        let modalConfig = {
          title: "Oops!",
          message: error.response.data.errors,
        };

        dispatch(hideLoader());
        dispatch(presentModal(modalConfig));
      }

      if (from === "BulkUpload") {
        let errorResponse = error.response.data.errors;
        // console.log("errorResponse ==> ", errorResponse);

        let errorResponseLength = getObjectLength(error.response.data.errors);
        // console.log("errorResponseLength ==> ", errorResponseLength);

        let errorMsg = "";
        if (errorResponseLength === 1) {
          errorMsg = Object.values(errorResponse)[0][0];
        }

        if (errorResponseLength > 1) {
          errorMsg = `${Object.values(errorResponse)[0][0]} +${
            errorResponseLength - 1
          } more.`;
        }

        // console.log("errorMsg ==> ", errorMsg);

        let { bulkUploadCreateAdvertList } = getState().bulkUpload;

        let modalConfig = {
          title: "Oops!",
          message: `An error prevented advert number <span style="font-weight:bold;color:#ff6100">${advertIndex}</span> from being submitted correctly. The cause of the error was <span style="font-weight:bold;color:#ff6100">${errorMsg}</span> Please rectify this and add the details for item number <span style="font-weight:bold;color:#ff6100">${advertIndex}</span> to another bulk upload or create the advert manually`,
          shouldRunFunction: true,
        };

        if (bulkUploadCreateAdvertList.length < 1) {
          modalConfig.functionHandler = "setSelectedTask";
          dispatch(presentModal(modalConfig));
          return;
        }

        modalConfig.functionHandler = "continueParsingadvert";
        dispatch(presentModal(modalConfig));
      }
    }
  }
);

// advertListApi GET
export const advertListApi = createAsyncThunk(
  "adverts/advertListApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.advertList(obj);
      // console.log("advertListApi response ==> ", response);
      const { data, status } = response;
      // console.log("advertListApi res ==> ", data.data, status);

      if (status === 200) {
        return data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      return rejectWithValue();
    }
  }
);

// editAdvertApi PUT
export const editAdvertApi = createAsyncThunk(
  "adverts/editAdvertApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { id, navigate, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.editAdvert(id, remObj);
      // console.log("editAdvertApi response ==> ", response);
      const { data, status } = response;
      // console.log("editAdvertApi res ==> ", data, status);

      if (status === 200) {
        navigate("/my-account/account-overview", { replace: true });

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

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

      let modalConfig = {
        title: "Oops!",
        message: error.response.data.errors,
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));
    }
  }
);

// pause / resume advert by id
export const pauseResumeAdvertApi = createAsyncThunk(
  "adverts/pauseResumeAdvertApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { advertId, navigate, advertStatus } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.pauseResumeAdvert(advertId, advertStatus);
      // console.log("pauseResumeAdvertApi response ==> ", response);
      const { data, status } = response;
      // console.log("pauseResumeAdvertApi res ==> ", data, status);

      if (status === 200) {
        dispatch(advertListApi(1));

        navigate("/my-account/my-adverts");

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // let modalConfig = {
      //   title: "Oops!",
      //   message: 'Something went wrong. Please try again!',
      // };

      dispatch(hideLoader());
      // dispatch(presentModal(modalConfig));
    }
  }
);

// delete advert by id
export const deleteAdvertByIdApi = createAsyncThunk(
  "adverts/deleteAdvertByIdApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { advertId, navigate } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.deleteAdvertById(advertId);
      // console.log("deleteAdvertByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("deleteAdvertByIdApi res ==> ", data, status);

      if (status === 200) {
        dispatch(advertDeleteSuccess(true));

        dispatch(advertListApi(1));

        navigate("/my-account/my-adverts");

        dispatch(hideLoader());
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: error.response.data.message,
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));
    }
  }
);

// advertByIdApi GET
export const advertByIdApi = createAsyncThunk(
  "adverts/advertByIdApi",
  async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(presentLoader());

      const response = await api.advertById(id);
      // console.log("advertByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("advertByIdApi data, status ==> ", data, status);

      if (status === 200) {
        // navigate(`/view-advert/${id}`, {
        //   state: from,
        // });

        dispatch(hideLoader());

        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      dispatch(hideLoader());

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  singleAdvert: {},
  advertList: [],
  advertMeta: {},
  advertLinks: {},
  advertListIsLoading: false,
  advertListApiIncPaginationEnabled: false,
  advertListApiDecPaginationEnabled: false,
  isPhotoModalVisible: false,
  deleteAdvertSuccess: false,
  manualAddressPickerOfPostcode: [],
  createAdvertIsLoadingComplete: false,
};

// AdvertsSlice
const AdvertsSlice = createSlice({
  name: "adverts",
  initialState,
  reducers: {
    // show photo modal
    showPhotoModal: (state, { payload }) => {
      state.isPhotoModalVisible = payload;
    },

    // set create advert is loading status
    setCreateAdvertIsLoadingComplete: (state, { payload }) => {
      state.createAdvertIsLoadingComplete = payload;
    },

    // manualAddressPostcodePicker
    manualAddressPostcodePicker: (state, { payload }) => {
      state.manualAddressPickerOfPostcode = payload;
    },

    // advertDeleteSuccess
    advertDeleteSuccess: (state, { payload }) => {
      state.deleteAdvertSuccess = payload;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.singleAdvert = {};
      state.advertList = [];
      state.advertMeta = {};
      state.advertLinks = {};
      state.advertListIsLoading = false;
      state.advertListApiIncPaginationEnabled = false;
      state.advertListApiDecPaginationEnabled = false;
      state.isPhotoModalVisible = false;
      state.deleteAdvertSuccess = false;
      state.manualAddressPickerOfPostcode = [];
      state.createAdvertIsLoadingComplete = false;
    },
  },
  extraReducers: {
    // createAdvertApi
    [createAdvertApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [createAdvertApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [createAdvertApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // advertListApi
    [advertListApi.pending]: (state, { payload }) => {
      // console.log("pending");
      state.advertListIsLoading = true;
    },
    [advertListApi.fulfilled]: (state, { payload }) => {
      state.advertList = payload.data ? payload.data : {};

      state.advertMeta = payload.meta ? payload.meta : {};

      state.advertLinks = payload.links ? payload.links : {};

      state.advertListApiIncPaginationEnabled =
        payload.meta.current_page < payload.meta.last_page ? true : false;

      state.advertListApiDecPaginationEnabled =
        payload.meta.current_page > 1 ? true : false;

      state.advertListIsLoading = false;
    },
    [advertListApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
      state.advertListIsLoading = false;
    },

    // editAdvertApi
    [editAdvertApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [editAdvertApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [editAdvertApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // advertByIdApi
    [advertByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [advertByIdApi.fulfilled]: (state, { payload }) => {
      state.singleAdvert = payload ? payload : {};
    },
    [advertByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // pauseResumeAdvertApi
    [pauseResumeAdvertApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [pauseResumeAdvertApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [pauseResumeAdvertApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // deleteAdvertByIdApi
    [deleteAdvertByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [deleteAdvertByIdApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [deleteAdvertByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const {
  showPhotoModal,
  setCreateAdvertIsLoadingComplete,
  manualAddressPostcodePicker,
  advertDeleteSuccess,
  resetStore,
} = AdvertsSlice.actions;

export default AdvertsSlice.reducer;
