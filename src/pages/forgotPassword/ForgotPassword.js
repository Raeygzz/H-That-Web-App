import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import "./ForgotPassword.css";
import { Alert } from "../../components/common/Alert";
import { EmailSchema } from "../../shared/validations/ForgotPassword";

import { useSelector, useDispatch } from "react-redux";
import { setError } from "../../toolkit/features/ErrorSlice";
import { setSuccess } from "../../toolkit/features/SuccessSlice";
import { fetchAsyncForgotPasswordApi } from "../../toolkit/features/ForgotPasswordSlice";

function ForgotPassword() {
  const { showSuccess } = useSelector((state) => state.success);
  const { successMessage } = useSelector((state) => state.success);
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);

  const [email, setEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    // set error
    let errorConfig = {
      errorMessage: "",
      showError: false,
    };

    dispatch(setError(errorConfig));

    // set success
    let successConfig = {
      successMessage: "",
      showSuccess: false,
    };

    dispatch(setSuccess(successConfig));

    // email validation
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
      };

      dispatch(fetchAsyncForgotPasswordApi(obj));
    }
  };

  useEffect(() => {
    if (showSuccess) {
      let successConfig = {
        successMessage: "",
        showSuccess: false,
      };

      setTimeout(() => {
        dispatch(setSuccess(successConfig));

        navigate("/");
      }, 1500);
    }

    if (showError) {
      let errorConfig = {
        errorMessage: "",
        showError: false,
      };

      setTimeout(() => {
        dispatch(setError(errorConfig));
      }, 3000);
    }
  }, [showSuccess, showError]);

  return (
    <div className="forgotPasswordWrapper">
      <div className="container">
        <div className="row px-3">
          <div className="col-lg-10 col-xl-9 card card-forgot flex-row mx-auto px-0">
            <div className="img-left d-none d-md-flex">
              <div className="logo-auth">
                <figcaption className="figcaption-forgot">
                  The Holistic Hire, Finance &amp; Selling Platform
                </figcaption>
              </div>
            </div>
            <div className="card-body card-body-forgot">
              <Alert
                showSuccess={showSuccess}
                showError={showError}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />

              <h4 className="title text-center mt-4">Forgot Password</h4>
              <div className="mb-3">
                <p>
                  Enter the email you registered with to <br />
                  receive a password reset mail
                </p>
              </div>
              <form className="form-box px-3" onSubmit={forgotPasswordHandler}>
                <div className="form-input pb-3">
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
                  <div className="mb-3"></div>
                </div>
                <div className="mb-0 resetPasswordDivStyle">
                  <button
                    type="submit"
                    className="btn btn-block btn-hover text-uppercase"
                  >
                    RESET PASSWORD
                  </button>
                </div>
                <div className="text-center mb-2 pt-3">
                  Remembered your password?&nbsp;
                  <Link to="/" className="register-link">
                    Login Here
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

export { ForgotPassword };
