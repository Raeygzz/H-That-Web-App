import React, { useState, useEffect } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import "./AddCard.css";
import { AuthConsumer } from "../../contexts";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../toolkit/features/AuthSlice";
import { getClientSecretApi } from "../../toolkit/features/CardSlice";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";

const AddCard = (props) => {
  const {} = props;

  const { user } = useSelector((state) => state.auth);
  const { email } = useSelector((state) => state.auth.user);

  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = AuthConsumer();

  useEffect(() => {
    if (email != "") {
      setUserEmail(email);
    }
  }, [email]);

  // backButtonHandler
  const backButtonHandler = () => {
    navigate(-1);
  };

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    dispatch(presentLoader());

    // console.log("stripe ==> ", stripe);
    // console.log("elements ==> ", elements);

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${process.env.REACT_APP_RETURN_URL}`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)

      setIsLoading(false);

      setErrorMessage(error.message);

      dispatch(hideLoader());
      //
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      dispatch(getClientSecretApi());

      let userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        login_with: user.login_with,
        completed_stripe_onboarding: user.completed_stripe_onboarding,
        has_primary_card: 1,
        has_primary_address: user.has_primary_address,
        has_business_profile: user.has_business_profile,
      };

      dispatch(setUser(userData));

      localStorage.setItem("user", JSON.stringify(userData));

      setIsLoading(false);

      navigate(-1);

      dispatch(hideLoader());
    }
  };

  // console.log("errorMessage ==> ", errorMessage);
  return (
    <>
      <div className="container">
        <a className="back pt-5 pb-2" onClick={backButtonHandler}>
          <FaArrowLeft /> Back to User settings
        </a>

        <form
          className="form-add-card my-5"
          id="payment-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            readOnly={true}
            name="userEmail"
            value={`Email                   ${userEmail}`}
            onChange={(e) => setUserEmail(e.target.value)}
          />

          <hr className="mt-4" />

          <span className="title-add-card">Save card information</span>

          <br />
          <br />

          <PaymentElement id="payment-element" />

          <button
            disabled={isLoading || !stripe}
            id="submit"
            className="button-add-card"
          >
            <span id="button-text">
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Save card"
              )}
            </span>
          </button>

          {/* Show error message to your customers */}
          {errorMessage && <div id="payment-message">{errorMessage}</div>}
          <div className="text-center mt-5 stripe">
            <span>
              Powered by <b>Stripe</b>
            </span>
            <br />
            <a
              className="a-add-card mr-2"
              href="https://stripe.com/en-gb-us/legal/payment-terms"
              hrefLang="en"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={"_blank"}
            >
              Terms
            </a>{" "}
            <a
              className="a-add-card"
              href="https://stripe.com/en-gb-us/privacy"
              hrefLang="en"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target={"_blank"}
            >
              Privacy
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export { AddCard };
