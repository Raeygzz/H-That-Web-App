import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Alert } from "../../components/common/Alert";

import "./Signup.css";
import { FROMEXTERNAL } from "../../constants";
import { firstNameFromFullName, lastNameFromFullName } from "../../utils";
import {
  EmailSchema,
  PasswordSchema,
  ConfirmPasswordSchema,
} from "../../shared/validations/Signup";

import { useSelector, useDispatch } from "react-redux";
import { setError } from "../../toolkit/features/ErrorSlice";
// import { setSuccess } from "../../toolkit/features/SuccessSlice";
import { setExternalPathname } from "../../toolkit/features/AuthSlice";
import { fetchAsyncSignupApi } from "../../toolkit/features/SignupSlice";

function Signup() {
  const { showSuccess } = useSelector((state) => state.success);
  const { successMessage } = useSelector((state) => state.success);
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);
  const { externalPathname } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(true);
  const [passwordValidate, setPasswordValidate] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordType, setConfirmPasswordType] = useState(true);
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false);

  const [termsPrivacy, setTermsPrivacy] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showHidePasswordHandler = (e) => {
    e.preventDefault();
    setPasswordType(!passwordType);
  };

  const showHideConfirmPasswordHandler = (e) => {
    e.preventDefault();
    setConfirmPasswordType(!confirmPasswordType);
  };

  const signupHandler = async (e) => {
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

    const validPassword = await PasswordSchema.isValid({ password: password });
    validPassword ? setPasswordValidate(false) : setPasswordValidate(true);

    const validConfirmPassword = await ConfirmPasswordSchema.isValid({
      confirmPassword: confirmPassword,
    });
    validConfirmPassword
      ? setConfirmPasswordValidate(false)
      : setConfirmPasswordValidate(true);

    if (!validPassword || !validConfirmPassword) {
      let errorConfig = {
        showError: true,
        errorMessage:
          "Password must contain one capital letter, one small letter, one special character, one number and must be between 8 to 16 characters.",
      };

      dispatch(setError(errorConfig));
    }

    if (validEmail && validPassword && validConfirmPassword) {
      if (password === confirmPassword) {
        let obj = {
          first_name: firstNameFromFullName(fullName) || "_",
          last_name: lastNameFromFullName(fullName) || "_",
          email: email,
          password: password,
          password_confirmation: confirmPassword,
          accepted_terms_and_conditions: termsPrivacy ? "1" : "0",
        };

        if (!FROMEXTERNAL.includes(`/${externalPathname.split("/")[1]}`)) {
          console.log("========= 0.5 =========");
          dispatch(setExternalPathname(""));
        }

        // console.log("obj ==> ", obj);
        dispatch(fetchAsyncSignupApi(obj));
        //
      } else {
        setPasswordValidate(true);
        setConfirmPasswordValidate(true);

        let errorConfig = {
          showError: true,
          errorMessage: "Passwords do not match.",
        };

        dispatch(setError(errorConfig));
      }
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

  return (
    <div className="signupWrapper">
      <div className="container">
        <div className="row px-3">
          <div className="col-lg-10 col-xl-9 card card-signup flex-row mx-auto px-0">
            <div className="img-left d-none d-md-flex">
              <div className="logo-auth">
                <figcaption className="figcaption-signup">
                  The Holistic Hire, Finance &amp; Selling Platform
                </figcaption>
              </div>
            </div>
            <div className="card-body card-body-signup px-0">
              <Alert
                showSuccess={showSuccess}
                showError={showError}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />

              <h4 className="title text-center mt-4">Sign-up for Free</h4>
              <form className="form-box px-3" onSubmit={signupHandler}>
                <div className="form-input">
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    name="fullName"
                    className="ml-2"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    tabIndex={10}
                    required
                  />
                </div>
                <div className="form-input">
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
                <div className="form-input">
                  <input
                    type={confirmPasswordType ? "password" : "text"}
                    placeholder="Enter Confirm Password"
                    name="confirmPassword"
                    className="ml-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    className="showHidePassword"
                    onClick={showHideConfirmPasswordHandler}
                  >
                    {confirmPasswordType ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="mb-5">
                  <div className="custom-control custom-checkbox p-0">
                    <input
                      // className="custom-control-input"
                      type="checkbox"
                      name="termsPrivacy"
                      checked={termsPrivacy}
                      onChange={(e) => setTermsPrivacy(e.target.checked)}
                      required
                    />
                    By creating an account and using Hire That agree to our{" "}
                    <a
                      className="a-signup"
                      href="https://hirethat.com/terms-of-use/"
                      hrefLang="en"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      target={"_blank"}
                    >
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      className="a-signup"
                      href="https://hirethat.com/privacy-policy/"
                      hrefLang="en"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      target={"_blank"}
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
                <div className="mb-0 registerButtonStyle">
                  <button
                    type="submit"
                    className="btn btn-hover btn-block text-uppercase"
                  >
                    Register
                  </button>
                </div>
                <div className="text-center mb-2 pt-3">
                  Already have an account?&nbsp;
                  <Link to="/" className="register-link">
                    Sign in here
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

export { Signup };
