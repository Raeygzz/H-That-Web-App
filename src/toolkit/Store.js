import { configureStore, combineReducers } from "@reduxjs/toolkit";
import Logger from "redux-logger";

import LoginReducer from "./features/LoginSlice";
import AuthReducer from "./features/AuthSlice";
import SignupReducer from "./features/SignupSlice";
import LoaderReducer from "./features/LoaderSlice";
import ErrorReducer from "./features/ErrorSlice";
import SuccessReducer from "./features/SuccessSlice";
import ForgotPasswordReducer from "./features/ForgotPasswordSlice";
import NetworkStatusReducer from "./features/NetworkStatusSlice";
import AddressReducer from "./features/AddressSlice";
import ModalReducer from "./features/ModalSlice";
import SearchLandingReducer from "./features/SearchLandingSlice";
import CategoriesReducer from "./features/CategoriesSlice";
import AdvertsReducer from "./features/AdvertsSlice";
import AdvertPhotosReducer from "./features/AdvertPhotosSlice";
import CalendarReducer from "./features/CalendarSlice";
import HireReducer from "./features/HireSlice";
import UserDetailReducer from "./features/UserDetailSlice";
import TradingAccountReducer from "./features/TradingAccountSlice";
import PaymentReducer from "./features/PaymentSlice";
import CardReducer from "./features/CardSlice";
import BuyReducer from "./features/BuySlice";
import BigCalendarReducer from "./features/BigCalendarSlice";
import BulkUploadReducer from "./features/BulkUploadSlice";

//combine reducer
const combinedReducer = combineReducers({
  login: LoginReducer,
  auth: AuthReducer,
  signup: SignupReducer,
  loader: LoaderReducer,
  error: ErrorReducer,
  success: SuccessReducer,
  forgotPassword: ForgotPasswordReducer,
  networkStatus: NetworkStatusReducer,
  address: AddressReducer,
  modal: ModalReducer,
  searchLanding: SearchLandingReducer,
  categories: CategoriesReducer,
  adverts: AdvertsReducer,
  advertPhotos: AdvertPhotosReducer,
  calendar: CalendarReducer,
  hire: HireReducer,
  userDetail: UserDetailReducer,
  tradingAccount: TradingAccountReducer,
  payment: PaymentReducer,
  buy: BuyReducer,
  card: CardReducer,
  bigCalendar: BigCalendarReducer,
  bulkUpload: BulkUploadReducer,
});

// root reducer
const rootReducer = (state, action) => {
  // store reset
  if (action.type === "auth/resetStore") {
    state = undefined;
  }

  return combinedReducer(state, action);
};

//store configure
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: [
      //     "modal/presentModal",
      //     "modal/hideModal",
      //     "loader/presentLoader",
      //     "loader/hideLoader",
      //     "searchLanding/nearMeHireApi/pending",
      //     "searchLanding/nearMeBuyApi/pending",
      //     "searchLanding/nearMeHireApi/fulfilled",
      //     "searchLanding/nearMeBuyApi/fulfilled",
      //     "address/deleteAddressApi/pending",
      //     "auth/userAccountDeleteApi/pending",
      //     "card/deleteCardApi/pending",
      //     "hire/cancelHiringApi/pending",
      //   ],
      //   // Ignore these field paths in all actions
      //   // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      //   // Ignore these paths in the state
      //   // ignoredPaths: ['items.dates'],
      // },
    }).concat(Logger),
});

export default store;
