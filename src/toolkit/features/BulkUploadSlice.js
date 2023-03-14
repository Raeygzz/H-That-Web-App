import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import { presentModal } from "./ModalSlice";
import { presentLoader, hideLoader } from "./LoaderSlice";
import { setSelectedNavLinks, routeTo } from "./AddressSlice";

import * as api from "../../services/axios/Api";

// toast option 3 sec
const Toast3Sec = {
  rtl: false,
  theme: "dark",
  draggable: true,
  autoClose: 3000,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true,
  progress: undefined,
  position: "top-right",
  hideProgressBar: false,
  pauseOnFocusLoss: false,
};

// bulkUploadTemplateApi
export const bulkUploadTemplateApi = createAsyncThunk(
  "bulkupload/bulkUploadTemplateApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { navigate, from, ...remObj } = obj;

    try {
      dispatch(presentLoader());

      const response = await api.bulkUploadTemplate(remObj);
      // console.log("bulkUploadTemplateApi response ==> ", response);
      const { data, status } = response;
      // console.log("bulkUploadTemplateApi res ==> ", data, status);

      if (status === 200) {
        if (from === "saveSettingsForFutureImportsHandler") {
          dispatch(setSelectedNavLinks(""));
          dispatch(routeTo("account-overview"));
          navigate("/my-account/account-overview");
        }

        dispatch(hideLoader());
        toast("Setting saved for future imports.", Toast3Sec);
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Some thing went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// getBulkUploadTemplateApi
export const getBulkUploadTemplateApi = createAsyncThunk(
  "bulkupload/getBulkUploadTemplateApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.getBulkUploadTemplate();
      // console.log("bulkUploadTemplateApi response ==> ", response);
      const { data, status } = response;
      // console.log("bulkUploadTemplateApi res ==> ", data, status);

      if (status === 200) {
        return data.data;
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let modalConfig = {
        title: "Oops!",
        message: "Some thing went wrong. Please try again!",
      };

      dispatch(hideLoader());
      dispatch(presentModal(modalConfig));

      return rejectWithValue();
    }
  }
);

// BulkTotalFunction
export const BulkTotalFunction = createAsyncThunk(
  "bulkupload/BulkTotalFunction",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { advertIndex, bulkTotal, bulkPhotosCount } = obj;

    // console.log("bulkTotal ==> ", bulkTotal);
    // console.log("advertIndex ==> ", advertIndex);
    // console.log("bulkPhotosCount ==> ", bulkPhotosCount);

    if (bulkTotal.length > 0) {
      bulkTotal.filter((obj, index) => {
        if (obj.advertIndex === advertIndex) {
          dispatch(bulkRemoveOne({ action: "setBulkTotal", index: index }));
        }
      });

      dispatch(
        setBulkTotal({
          advertIndex: advertIndex,
          bulkPhotosCount: bulkPhotosCount,
        })
      );

      return;
    }

    dispatch(
      setBulkTotal({
        advertIndex: advertIndex,
        bulkPhotosCount: bulkPhotosCount,
      })
    );
  }
);

// BulkPhotosFunction
export const BulkPhotosFunction = createAsyncThunk(
  "bulkupload/BulkPhotosFunction",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { advertIndex, bulkPhotos, bulkImages } = obj;

    // console.log("obj ==> ", obj);
    console.log("bulkImages ==> ", bulkImages);
    console.log("bulkPhotos ==> ", bulkPhotos);
    console.log("advertIndex ==> ", advertIndex);
    // console.log("length ==> ", bulkPhotos[advertIndex]?.bulkPhotos?.length);

    let particularBulkPhotos =
      bulkPhotos.length > 0
        ? bulkPhotos.find((ele) => {
            return ele.advertIndex === advertIndex;
          })
        : undefined;

    console.log("particularBulkPhotos ==> ", particularBulkPhotos);

    // if (bulkPhotos[advertIndex]?.bulkPhotos?.length > 0) {
    if (particularBulkPhotos != undefined) {
      let tempArr = [];

      bulkPhotos.filter((obj, index) => {
        if (obj.advertIndex === advertIndex) {
          tempArr.push(obj.bulkPhotos);

          dispatch(bulkRemoveOne({ action: "setBulkPhotos", index: index }));
        }
      });

      tempArr.push(bulkImages);
      // console.log("temp ==> ", tempArr);

      const mergeTempArr = [...tempArr[0], ...tempArr[1]];
      // console.log("mergeTempArr ==> ", mergeTempArr);

      dispatch(
        setBulkPhotos({ advertIndex: advertIndex, bulkPhotos: mergeTempArr })
      );

      return;
    }

    dispatch(
      setBulkPhotos({ advertIndex: advertIndex, bulkPhotos: bulkImages })
    );
  }
);

// initial state
const initialState = {
  selectedTask: "upload",
  csvFileName: "",
  csvTojson: [],
  csvToAdverts: [],
  numberOfImportedAdverts: 0,
  isBulkPhotoModalVisible: false,
  bulkPhotos: [] /* { advertIndex: 0, bulkPhotos: [] } */,
  bulkMainImage: [],
  bulkPhotosCount: [],
  bulkUploadCreateAdvertList: [],
  executeBulkPostAdvert: false,
  bulkUploadTemplate: {},
};

// BulkUploadSlice
const BulkUploadSlice = createSlice({
  name: "bulkupload",
  initialState,
  reducers: {
    // setSelectedTask action
    setSelectedTask: (state, { payload }) => {
      state.selectedTask = payload;
    },

    // setCsvFileName action
    setCsvFileName: (state, { payload }) => {
      state.csvFileName = payload;
    },

    // setCsvToJson action
    setCsvToJson: (state, { payload }) => {
      state.csvTojson = payload;
    },

    // setBulkUploadTemplate
    setBulkUploadTemplate: (state, { payload }) => {
      state.bulkUploadTemplate = payload;
    },

    // setCsvToAdverts action
    setCsvToAdverts: (state, { payload }) => {
      state.csvToAdverts = payload;
    },

    // setNumberOfImportedAdverts action
    setNumberOfImportedAdverts: (state, { payload }) => {
      state.numberOfImportedAdverts = payload;
    },

    // show bulk photo modal
    showBulkPhotoModal: (state, { payload }) => {
      state.isBulkPhotoModalVisible = payload;
    },

    // setBulkMainImage action
    setBulkMainImage: (state, { payload }) => {
      state.bulkMainImage.push(payload);
    },

    // setBulkPhotos action
    setBulkPhotos: (state, { payload }) => {
      state.bulkPhotos.push(payload);
    },

    // setBulkTotal
    setBulkTotal: (state, { payload }) => {
      state.bulkPhotosCount.push(payload);
    },

    // bulkRemoveOne action
    bulkRemoveOne: (state, { payload }) => {
      const { action, index } = payload;

      if (action === "setBulkTotal") {
        state.bulkPhotosCount.splice(index, 1);
      }

      if (action === "setBulkPhotos") {
        state.bulkPhotos.splice(index, 1);
      }
    },

    // bulkRemoveAll action
    bulkRemoveAll: (state, { payload }) => {
      state.isBulkPhotoModalVisible = false;
      state.bulkPhotos = [];
      state.bulkMainImage = [];
      state.bulkPhotosCount = [];
    },

    // setBulkUploadCreateAdvertList
    setBulkUploadCreateAdvertList: (state, { payload }) => {
      state.bulkUploadCreateAdvertList = payload;
    },

    // setExecuteBulkPostAdvert
    setExecuteBulkPostAdvert: (state, { payload }) => {
      state.executeBulkPostAdvert = payload;
    },

    // reset bulk upload  action
    resetBulkUpload: (state, { payload }) => {
      state.selectedTask = "upload";
      state.csvFileName = "";
      state.csvTojson = [];
      state.csvToAdverts = [];
      state.numberOfImportedAdverts = 0;
      state.isBulkPhotoModalVisible = false;
      state.bulkPhotos = [];
      state.bulkMainImage = [];
      state.bulkPhotosCount = [];
      state.bulkUploadCreateAdvertList = [];
      state.executeBulkPostAdvert = false;
      state.bulkUploadTemplate = {};
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.selectedTask = "upload";
      state.csvFileName = "";
      state.csvTojson = [];
      state.csvToAdverts = [];
      state.numberOfImportedAdverts = 0;
      state.isBulkPhotoModalVisible = false;
      state.bulkPhotos = [];
      state.bulkMainImage = [];
      state.bulkPhotosCount = [];
      state.bulkUploadCreateAdvertList = [];
      state.executeBulkPostAdvert = false;
      state.bulkUploadTemplate = {};
    },
  },
  extraReducers: {
    // bulkUploadTemplateApi
    [bulkUploadTemplateApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [bulkUploadTemplateApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [bulkUploadTemplateApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // getBulkUploadTemplateApi
    [getBulkUploadTemplateApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [getBulkUploadTemplateApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
      state.bulkUploadTemplate = payload;
    },
    [getBulkUploadTemplateApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // BulkPhotosFunction
    [BulkPhotosFunction.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [BulkPhotosFunction.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [BulkPhotosFunction.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // BulkTotalFunction
    [BulkTotalFunction.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [BulkTotalFunction.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [BulkTotalFunction.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const {
  setSelectedTask,
  setCsvFileName,
  setCsvToJson,
  setBulkUploadTemplate,
  setCsvToAdverts,
  setNumberOfImportedAdverts,
  showBulkPhotoModal,
  setBulkMainImage,
  setBulkPhotos,
  setBulkTotal,
  bulkPhotoDeleteSuccess,
  bulkRemoveOne,
  bulkRemoveAll,
  setBulkUploadCreateAdvertList,
  setExecuteBulkPostAdvert,
  resetBulkUpload,
  resetStore,
} = BulkUploadSlice.actions;

export default BulkUploadSlice.reducer;
