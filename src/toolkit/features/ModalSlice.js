import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  presentModal: false,
  data: null,
  modalTitle: "",
  modalMessage: "",
  showCancelButton: true,
  cancelButtonText: "NEVER MIND",
  okButtonText: "Ok",
  shouldLogout: false,
  shouldNavigate: false,
  navigation: "",
  navigateTo: "",
  shouldRunFunction: false,
  shouldCallback: null,
  shouldCallback_2: null,
  functionHandler: "",
  cancelButtonFunctionHandler: "",
};

// ModalSlice
const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // presentModal action
    presentModal: (state, { payload }) => {
      state.presentModal = true;

      state.data = payload.data != null ? payload.data : null;

      state.modalTitle = payload.title != "" ? payload.title : "";

      state.modalMessage = payload.message != "" ? payload.message : "";

      state.showCancelButton =
        payload.showCancelButton === true ? payload.showCancelButton : false;

      state.cancelButtonText = payload.cancelButtonText
        ? payload.cancelButtonText
        : "NEVER MIND";

      state.okButtonText = payload.okButtonText ? payload.okButtonText : "Ok";

      state.shouldLogout = payload.shouldLogout ? payload.shouldLogout : false;

      state.shouldNavigate = payload.shouldNavigate
        ? payload.shouldNavigate
        : false;

      state.navigation = payload.navigation ? payload.navigation : "";

      state.navigateTo = payload.navigateTo ? payload.navigateTo : "";

      state.shouldRunFunction = payload.shouldRunFunction
        ? payload.shouldRunFunction
        : false;

      state.shouldCallback = payload.shouldCallback
        ? payload.shouldCallback
        : null;

      state.shouldCallback_2 = payload.shouldCallback_2
        ? payload.shouldCallback_2
        : null;

      state.functionHandler = payload.functionHandler
        ? payload.functionHandler
        : "";

      state.cancelButtonFunctionHandler = payload.cancelButtonFunctionHandler
        ? payload.cancelButtonFunctionHandler
        : "";
    },

    // hideModal action
    hideModal: (state, { payload }) => {
      state.presentModal = false;
      state.data = null;
      state.modalTitle = "";
      state.modalMessage = "";
      state.showCancelButton = true;
      state.cancelButtonText = "NEVER MIND";
      state.okButtonText = "Ok";
      state.shouldLogout = false;
      state.shouldNavigate = false;
      state.navigation = "";
      state.navigateTo = "";
      state.shouldRunFunction = false;
      state.shouldCallback = null;
      state.shouldCallback_2 = null;
      state.functionHandler = "";
      state.cancelButtonFunctionHandler = "";
    },

    // resetStore action
    resetStore: (state, { payload }) => {
      state.presentModal = false;
      state.data = null;
      state.modalTitle = "";
      state.modalMessage = "";
      state.showCancelButton = true;
      state.cancelButtonText = "NEVER MIND";
      state.okButtonText = "Ok";
      state.shouldLogout = false;
      state.shouldNavigate = false;
      state.navigation = "";
      state.navigateTo = "";
      state.shouldRunFunction = false;
      state.shouldCallback = null;
      state.shouldCallback_2 = null;
      state.functionHandler = "";
      state.cancelButtonFunctionHandler = "";
    },

    // // executeFunction_findUserLocationItemsNearMeHandler
    // executeFunction_findUserLocationItemsNearMeHandler: (
    //   state,
    //   { payload }
    // ) => {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       // console.log("position ==> ", position);

    //       let obj = {
    //         page: 1,
    //         navigate: navigate,
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       };

    //       dispatch(nearMeHireApi(obj));
    //       dispatch(nearMeBuyApi(obj));
    //     },

    //     (error) => {
    //       console.error("Error Code = " + error.code + " - " + error.message);
    //     }
    //   );
    // },
  },
});

export const {
  presentModal,
  hideModal,
  resetStore,
  // executeFunction_findUserLocationItemsNearMeHandler,
} = ModalSlice.actions;

export default ModalSlice.reducer;
