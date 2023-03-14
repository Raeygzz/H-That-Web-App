import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import MainRoute from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, LocationProvider } from "./contexts";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  Header,
  Footer,
  Loader,
  Modal,
  ScrollToTop,
} from "./components/common";

import { useSelector, useDispatch } from "react-redux";
import { networkStatus } from "./toolkit/features/NetworkStatusSlice";
import { setToken, setUser, resetStore } from "./toolkit/features/AuthSlice";

function App() {
  const { accessToken } = useSelector((state) => state.auth);
  const { presentModal } = useSelector((state) => state.modal);
  const { presentLoader } = useSelector((state) => state.loader);
  const { externalPathname } = useSelector((state) => state.auth);
  const { has_primary_address } = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // fetch user / token from localStorage
  useEffect(() => {
    async function fetchToken() {
      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (token && user) {
          dispatch(setUser(JSON.parse(user)));
          dispatch(setToken(token));

          console.log("========= 0 =========");
          //
        } else {
        }
        //
      } catch (e) {
        dispatch(resetStore());
      }
    }

    fetchToken();
  }, []);

  // console.log("app-externalPathname ==> ", externalPathname);

  /**
   * redirect to specific external link or
   * navigate to search-landing
   */
  useEffect(() => {
    if (accessToken != "") {
      if (externalPathname != "") {
        console.log("========= 1 =========");
        navigate(externalPathname, { replace: true });
        return;
      }

      if (has_primary_address !== 1) {
        console.log("========= 2 ===========");
        navigate("/onboarding-user-address", { replace: true });
        return;
      }

      console.log("========= 3 =========");
      //
    } else {
      console.log("========= 4 =========");
    }
  }, [accessToken, externalPathname, has_primary_address]);

  // network connectivity check
  useEffect(() => {
    // online handler
    const handleOnline = () => {
      dispatch(
        networkStatus({ onlineStatus: true, since: new Date().toString() })
      );
    };

    // offline handler
    const handleOffline = () => {
      dispatch(
        networkStatus({ onlineStatus: false, since: new Date().toString() })
      );
    };

    // event listener
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // cleanup code
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="app">
      {accessToken && <Header />}

      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />

      <ScrollToTop>
        <AuthProvider>
          <LocationProvider>
            <MainRoute />
          </LocationProvider>
        </AuthProvider>
      </ScrollToTop>

      {presentModal && <Modal />}
      {presentLoader && <Loader />}

      <Footer />
    </div>
  );
}

export default App;
