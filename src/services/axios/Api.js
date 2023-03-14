import axios from "axios";

// login
export const login = (body) => {
  const options = {
    url: `/api/user/login`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// signUp
export const signUp = (body) => {
  const options = {
    url: `/api/user`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// forgotPassword
export const forgotPassword = (body) => {
  const options = {
    url: `/api/forgot-password/email`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// addressList
export const addressList = () => {
  const options = {
    url: `/api/user/address`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// createAddress
export const createAddress = (body) => {
  const options = {
    url: `/api/user/address`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// updateAddress
export const updateAddress = (addressId, body) => {
  const options = {
    url: `/api/user/address/${addressId}`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// deleteAddressById
export const deleteAddressById = (addressId) => {
  const options = {
    url: `/api/user/address/${addressId}`,
    data: null,
    method: "delete",
  };

  return axios(options);
};

// findAddressFromPostcode
export const findAddressFromPostcode = (postcode) => {
  const options = {
    url: `${process.env.REACT_APP_POSTCODES_TO_ADDRESS}${postcode}?api-key=${process.env.REACT_APP_GET_ADDRESS_API_KEY}`,
    // url: `${process.env.REACT_APP_POSTCODES_TO_ADDRESS}${postcode}?expand=true&api-key=${process.env.REACT_APP_GET_ADDRESS_API_KEY}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// // searchItem
// export const searchItem = (searchItemPageNumber, body) => {
//   const options = {
//     url: `/api/item/search?page=${searchItemPageNumber}`,
//     data: body,
//     method: "post",
//   };

//   return axios(options);
// };

// nearMe
export const nearMe = (nearMePageNumber, body) => {
  const options = {
    url: `/api/item/search/near-me?page=${nearMePageNumber}`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// filterSearchItem
export const filterSearchItem = (filterSearchItemPageNumber, body) => {
  const options = {
    url: `/api/item/search/filter/web?page=${filterSearchItemPageNumber}`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// categories
export const categories = () => {
  const options = {
    url: `/api/category`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// subCategories
export const subCategories = (categoryId) => {
  const options = {
    url: `/api/category/${categoryId}/sub-category`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// createAdvert
export const createAdvert = (body) => {
  const options = {
    url: `/api/v2/item`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// advertList
export const advertList = (pageNumber) => {
  const options = {
    url: `/api/item?page=${pageNumber}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// advertById
export const advertById = (advertId) => {
  const options = {
    url: `/api/item/${advertId}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// calendarUnavailableDateList
export const calendarUnavailableDateList = (advertId) => {
  const options = {
    url: `/api/item/${advertId}/calender`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// editAdvert
export const editAdvert = (advertId, body) => {
  const options = {
    url: `/api/v2/item/${advertId}`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// hiringInList
export const hiringInList = (hiringInPageNumber) => {
  const options = {
    url: `/api/item-hiring?page=${hiringInPageNumber}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// hiringOutList
export const hiringOutList = (hiringOutPageNumber) => {
  const options = {
    url: `/api/item-hiring-out?page=${hiringOutPageNumber}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// calendarDatesMakingUnavailable
export const calendarDatesMakingUnavailable = (advertId, dates) => {
  const options = {
    url: `/api/item/${advertId}/calender`,
    data: dates,
    method: "post",
  };

  return axios(options);
};

// calendarDateDeleteById
export const calendarDateDeleteById = (advertId, dates) => {
  const options = {
    url: `/api/item/${advertId}/calender/delete`,
    data: dates,
    method: "post",
  };

  return axios(options);
};

// getPhotosList
export const getPhotosList = (advertId) => {
  const options = {
    url: `/api/item/${advertId}/photos`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// storePhotos
export const storePhotos = (advertId, body) => {
  const options = {
    url: `/api/item/${advertId}/photos`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// deletePhotoById
export const deletePhotoById = (advertId, photoId) => {
  const options = {
    url: `/api/item/${advertId}/photo/${photoId}`,
    data: null,
    method: "delete",
  };

  return axios(options);
};

// pauseResumeAdvert
export const pauseResumeAdvert = (advertId, advertStatus) => {
  const options = {
    url: `/api/item/${advertId}/${advertStatus}`,
    data: null,
    method: "post",
  };

  return axios(options);
};

// deleteAdvertById
export const deleteAdvertById = (advertId) => {
  const options = {
    url: `/api/item/${advertId}`,
    data: null,
    method: "delete",
  };

  return axios(options);
};

// getUserDetail
export const getUserDetail = (userId) => {
  const options = {
    url: `/api/user/${userId}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// putUserDetail
export const putUserDetail = (userID, body) => {
  const options = {
    url: `/api/user/${userID}`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// userBusinessProfile
export const userBusinessProfile = (body = null, method) => {
  const options = {
    url: `/api/user/business-profile`,
    data: body,
    method: method,
  };

  return axios(options);
};

// getStripeBalance
export const getStripeBalance = () => {
  const options = {
    url: `/api/user/stripe/balance`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// listUserCards
export const listUserCards = () => {
  const options = {
    url: `/api/list-cards`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// userAccountDelete
export const userAccountDelete = (userId) => {
  const options = {
    url: `/api/user/${userId}`,
    data: null,
    method: "delete",
  };

  return axios(options);
};

// defaultCard
export const defaultCard = (cardID) => {
  const options = {
    url: `/api/make-card-default/${cardID}`,
    data: null,
    method: "post",
  };

  return axios(options);
};

// deleteCard
export const deleteCard = (cardID) => {
  const options = {
    url: `/api/delete-card/${cardID}`,
    data: null,
    method: "delete",
  };

  return axios(options);
};

// getClientSecret
export const getClientSecret = () => {
  const options = {
    url: `/api/save-card/client-secret`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// hiringById
export const hiringById = (hiringId) => {
  const options = {
    url: `/api/item-hiring/${hiringId}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// cancelHiring
export const cancelHiring = (hiringId) => {
  const options = {
    url: `/api/cancel-item-hire/${hiringId}`,
    data: null,
    method: "post",
  };

  return axios(options);
};

// sendEmail
export const sendEmail = (body) => {
  const options = {
    url: `/api/enquire-to-buy`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// getStripeConnect
export const getStripeConnect = (from) => {
  const options = {
    url: `/api/redirect-stripe-connnect/web?from=${from}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// findDistance
export const findDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const options = {
    url: `/api/find-distance?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`,
    // url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude1},${longitude1}&destinations=${latitude2},${longitude2}&region=GB&mode=driving&language=en&sensor=false&units=imperial&key=${process.env.REACT_APP_GOOGLE_KEY}`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// dayToPrice
export const dayToPrice = (body) => {
  const options = {
    url: `/api/v2/item-hire/price`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// itemHire
export const itemHire = (body) => {
  const options = {
    url: `/api/v2/item-hire`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// hireItemPayment
export const hireItemPayment = (body) => {
  const options = {
    url: `/api/pay-item-hire`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// bulkUploadTemplate
export const bulkUploadTemplate = (body) => {
  const options = {
    url: `/api/user/bulk-upload-template`,
    data: body,
    method: "post",
  };

  return axios(options);
};

// getBulkUploadTemplate
export const getBulkUploadTemplate = () => {
  const options = {
    url: `/api/user/bulk-upload-template`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// getHireCalendarHiring
export const getHireCalendarHiring = () => {
  const options = {
    url: `/api/hire-calendar-hiring`,
    data: null,
    method: "get",
  };

  return axios(options);
};

// getHireCalendarHiringOut
export const getHireCalendarHiringOut = () => {
  const options = {
    url: `/api/hire-calendar-hiring-out`,
    data: null,
    method: "get",
  };

  return axios(options);
};
