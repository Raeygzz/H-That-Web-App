import React, { useState, useEffect } from "react";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AppleSignin, {
  useScript,
  appleAuthHelpers,
} from "react-apple-signin-auth";

import "./Login.css";
import { FROMEXTERNAL } from "../../constants";
import { Alert } from "../../components/common";
import { EmailSchema } from "../../shared/validations/Login";

import { useSelector, useDispatch } from "react-redux";
// import { unwrapResult } from "@reduxjs/toolkit";
import { setError } from "../../toolkit/features/ErrorSlice";
// import { setSuccess } from "../../toolkit/features/SuccessSlice";
import { setExternalPathname } from "../../toolkit/features/AuthSlice";
import { fetchAsyncLoginApi } from "../../toolkit/features/LoginSlice";

function Login() {
  const { showSuccess } = useSelector((state) => state.success);
  const { successMessage } = useSelector((state) => state.success);
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);
  const { externalPathname } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appleSignInHandler = (e) => {
    e.preventDefault();

    console.log("appleSignInHandler");
    appleAuthHelpers.signIn({
      authOptions: {
        /** Client ID - eg: 'com.example.com' */
        clientId: "com.hirethat.com",
        /** Requested scopes, seperated by spaces - eg: 'email name' */
        scope: "email name",
        /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
        redirectURI: "https://web.hirethat.com",
        /** State string that is returned with the apple response */
        state: "state",
        /** Nonce */
        nonce: "nonce",
        /** Uses popup auth instead of redirection */
        usePopup: true,
        //  usePopup: ${authOptions.usePopup},
      },
      onSuccess: (response) => console.log("response ==> ", response),
      onError: (error) => console.error("error ==> ", error),
    });
  };

  const showHidePasswordHandler = (e) => {
    e.preventDefault();
    setPasswordType(!passwordType);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    // set error
    let errorConfig = {
      errorMessage: "",
      showError: false,
    };

    dispatch(setError(errorConfig));

    // // set success
    // let successConfig = {
    //   successMessage: "",
    //   showSuccess: false,
    // };
    // dispatch(setSuccess(successConfig));

    const validEmail = await EmailSchema.isValid({ email: email });
    validEmail ? setEmailValidate(false) : setEmailValidate(true);

    if (!validEmail) {
      let errorConfig = {
        showError: true,
        errorMessage: "Please enter a valid email.",
      };

      dispatch(setError(errorConfig));
    }

    if (validEmail) {
      let obj = {
        email: email,
        password: password,
      };

      // // method with unwrapResult
      // dispatch(fetchAsyncLoginApi(obj))
      //   .then(unwrapResult)
      //   .then((obj) => console.log("obj ==> ", obj))
      //   .catch((err) => console.log("err ==> ", err));

      if (!FROMEXTERNAL.includes(`/${externalPathname.split("/")[1]}`)) {
        console.log("========= 0.5 =========");
        dispatch(setExternalPathname(""));
      }

      dispatch(fetchAsyncLoginApi(obj));
    }
  };

  useEffect(() => {
    // if (showSuccess) {
    //   let successConfig = {
    //     successMessage: "",
    //     showSuccess: false,
    //   };
    //   setTimeout(() => {
    //     dispatch(setSuccess(successConfig));
    //     navigate("/search-landing");
    //   }, 1500);
    // }

    if (showError) {
      let errorConfig = {
        errorMessage: "",
        showError: false,
      };

      setTimeout(() => {
        dispatch(setError(errorConfig));
      }, 1500);
    }
  }, [showError]);

  const forgotPasswordHandler = () => {
    navigate(`/forgot-password`);
  };

  return (
    <div className="loginWrapper">
      <div className="container">
        <div className="row px-3">
          <div className="col-lg-10 col-xl-9 card card-login flex-row mx-auto px-0">
            <div className="img-left d-none d-md-flex">
              <div className="logo-auth">
                <figcaption className="figcaption-login">
                  The Holistic Hire, Finance &amp; Selling Platform
                </figcaption>
              </div>
            </div>
            <div className="card-body card-body-login">
              <Alert
                showSuccess={showSuccess}
                showError={showError}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />

              <h4 className="title text-center mt-4">Sign In</h4>
              <form className="form-box px-3" onSubmit={loginHandler}>
                <div className="form-input">
                  <div className="mb-0 signInButtonDivStyle">
                    <button
                      type="apple"
                      className="btn btn-block btn-hover text-uppercase"
                      onClick={appleSignInHandler}
                    >
                      Sign in with apple
                    </button>
                  </div>
                  <p style={{ textAlign: "center" }}>
                    <b>or</b>
                  </p>
                  <input
                    type="email"
                    placeholder="Enter email-address"
                    name="email"
                    className="ml-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type={passwordType ? "password" : "text"}
                    placeholder="Enter Password"
                    name="password"
                    className="ml-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    className="showHidePassword"
                    onClick={showHidePasswordHandler}
                  >
                    {passwordType ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="mb-3">
                  <div className="custom-control custom-checkbox"></div>
                </div>
                <div className="mb-0 signInButtonDivStyle">
                  <button
                    type="submit"
                    className="btn btn-block btn-hover text-uppercase"
                  >
                    Sign In
                  </button>
                </div>
                <div className="mb-0 signInButtonDivStyle">
                  <button
                    type="forgot"
                    className="btn btn-block btn-hover text-uppercase"
                    onClick={forgotPasswordHandler}
                  >
                    Forgot Password
                  </button>
                </div>
                <div className="text-center mb-2">
                  Don't have an account?&nbsp;
                  <Link to="/signup" className="register-link">
                    Register for free
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
