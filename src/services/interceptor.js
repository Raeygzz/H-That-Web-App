// setup AXIOS INTERCEPTOR
import axios from "axios";

import { toast } from "react-toastify";

import Store from "../toolkit/Store";
import { hideLoader } from "../toolkit/features/LoaderSlice";

export const Interceptor = () => {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  axios.defaults.headers.post["Accept"] = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  // axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";

  // interceptor request
  axios.interceptors.request.use(
    async function (config) {
      const store = Store.getState();
      // console.log("store ==> ", store);
      // console.log("networkStatus ==> ", store.networkStatus.onlineStatus);

      if (!store.networkStatus.onlineStatus) {
        Store.dispatch(hideLoader());
        toast("No internet connection. Please try again!");
      }

      if (store.networkStatus.onlineStatus) {
        let endpoint = config.url;
        // console.log("endpoint ==> ", endpoint);

        const token = localStorage.getItem("accessToken");
        if (token != null && token != "") {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // console.log("config ==> ", config);
        return config;
      }
    },

    // interceptor request error
    function (err) {
      return Promise.reject(err);
    }
  );

  // interceptor response
  axios.interceptors.response.use(
    (response) => {
      // console.log("interceptors-response ==> ", response);
      return response;
    },

    // interceptor response error
    (error) => {
      // we have the error
      // we focus on token expired
      const message = error.response.data.message;
      const statusCode = error.response.status;
      const originalRequest = error.config;

      // console.log("errorResponse ==> ", {
      //   message: message,
      //   statusCode: statusCode,
      //   originalRequest: originalRequest,
      // });

      return Promise.reject(error);
    }
  );
};
