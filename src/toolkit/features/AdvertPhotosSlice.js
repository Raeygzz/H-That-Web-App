import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setError } from "./ErrorSlice";
import { showPhotoModal } from "./AdvertsSlice";

import * as api from "../../services/axios/Api";

// // getPhotosListApi
// export const getPhotosListApi = createAsyncThunk(
//   "advertPhotos/getPhotosListApi",
//   async (id, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
//     try {
//       const response = await api.getPhotosList(id);
//       // console.log("getPhotosListApi response ==> ", response);
//       const { data, status } = response;
//       // console.log("getPhotosListApi res ==> ", data, status);

//       if (status === 200) {
//         return data.data;
//       }
//     } catch (error) {
//       // console.log(`error.response: ==> `, error.response);

//       // if (error.response) {
//       //   // 400
//       //   if (error.response.status === 400) {}

//       //   // 422
//       //   if (error.response.status === 422) {}
//       // }

//       let errorConfig = {
//         showError: true,
//         errorMessage:
//           "Some thing went wrong while fetching list of photos. Please try again!",
//       };

//       dispatch(setError(errorConfig));

//       return rejectWithValue();
//     }
//   }
// );

// storePhotosApi
export const storePhotosApi = createAsyncThunk(
  "advertPhotos/storePhotosApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { id, ...remObj } = obj;

    try {
      const response = await api.storePhotos(id, remObj);
      // console.log("storePhotosApi response ==> ", response);
      const { data, status } = response;
      // console.log("storePhotosApi res ==> ", data, status);

      if (status === 200) {
        dispatch(showPhotoModal(false));
      }
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      let errorConfig = {
        showError: true,
        errorMessage:
          "Some thing went wrong while uploading the photo. Please try again!",
      };

      dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// deletePhotoByIdApi
export const deletePhotoByIdApi = createAsyncThunk(
  "advertPhotos/deletePhotoByIdApi",
  async (obj, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    const { advertId, photoId } = obj;

    try {
      const response = await api.deletePhotoById(advertId, photoId);
      // console.log("deletePhotoByIdApi response ==> ", response);
      const { data, status } = response;
      // console.log("deletePhotoByIdApi res ==> ", data, status);

      if (status === 200) {
        dispatch(photoDeleteSuccess(true));
      }
      //
    } catch (error) {
      // console.log(`error.response: ==> `, error.response);

      // let errorConfig = {
      //   showError: true,
      //   errorMessage: "Some thing went wrong. Please try again!",
      // };

      // dispatch(setError(errorConfig));

      return rejectWithValue();
    }
  }
);

// initial state
const initialState = {
  // fetchedPhotos: [],
  photos: [],
  mainImage: "",
  photosCount: 0,
  deletePhotoSuccess: false,
};

// AdvertPhotosSlice
const AdvertPhotosSlice = createSlice({
  name: "advertPhotos",
  initialState,
  reducers: {
    // addMainImage action
    addMainImage: (state, { payload }) => {
      state.mainImage = payload;
    },

    // addPhotos action
    addPhotos: (state, { payload }) => {
      state.photos.push(payload);
    },

    // setCount
    setCount: (state, { payload }) => {
      state.photosCount = payload;
    },

    // photoDeleteSuccess action
    photoDeleteSuccess: (state, { payload }) => {
      state.deletePhotoSuccess = payload;
    },

    // deleteOne action
    deleteOne: (state, { payload }) => {
      state.photos.splice(payload, 1);
    },

    // deleteAll action
    deleteAll: (state, { payload }) => {
      // state.fetchedPhotos = [];
      state.photos = [];
      state.mainImage = "";
      state.photosCount = 0;
      state.deletePhotoSuccess = false;
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      // state.fetchedPhotos = [];
      state.photos = [];
      state.mainImage = "";
      state.photosCount = 0;
      state.deletePhotoSuccess = false;
    },
  },
  extraReducers: {
    // // getPhotosListApi
    // [getPhotosListApi.pending]: (state, { payload }) => {
    //   // console.log("pending");
    // },
    // [getPhotosListApi.fulfilled]: (state, { payload }) => {
    //   // state.photos = payload.photos;
    //   state.fetchedPhotos = payload.photos;
    // },
    // [getPhotosListApi.rejected]: (state, { payload }) => {
    //   // console.log("rejected");
    // },

    // storePhotosApi
    [storePhotosApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [storePhotosApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [storePhotosApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },

    // deletePhotoByIdApi
    [deletePhotoByIdApi.pending]: (state, { payload }) => {
      // console.log("pending");
    },
    [deletePhotoByIdApi.fulfilled]: (state, { payload }) => {
      // console.log("fulfilled");
    },
    [deletePhotoByIdApi.rejected]: (state, { payload }) => {
      // console.log("rejected");
    },
  },
});

export const {
  addMainImage,
  addPhotos,
  setCount,
  deleteOne,
  deleteAll,
  photoDeleteSuccess,
  resetStore,
} = AdvertPhotosSlice.actions;

export default AdvertPhotosSlice.reducer;
