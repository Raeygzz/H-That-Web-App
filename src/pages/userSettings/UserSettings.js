import React, { useState, useEffect } from "react";

import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./UserSettings.css";
import { AuthConsumer } from "../../contexts";
import { cardLastFourDigitDisplay } from "../../utils";
import { StripeConnectShimmer } from "../../components/common";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { userAccountDeleteApi } from "../../toolkit/features/AuthSlice";
import { getUserDetailApi } from "../../toolkit/features/UserDetailSlice";
import { getUserBusinessProfileApi } from "../../toolkit/features/TradingAccountSlice";
import {
  getStripeConnectApi,
  getStripeBalanceApi,
} from "../../toolkit/features/PaymentSlice";
import {
  listUserCardsApi,
  defaultCardApi,
  clearMakeDefaultCheckbox,
  deleteCardApi,
} from "../../toolkit/features/CardSlice";

const UserSettings = (props) => {
  const {} = props;

  const { user } = useSelector((state) => state.auth);
  const { completed_stripe_onboarding } = useSelector(
    (state) => state.auth.user
  );
  const detailsSubmitted = useSelector(
    (state) => state.auth.user?.stripe_details?.details_submitted
  );
  const additionalInformationRequired = useSelector(
    (state) => state.auth.user?.stripe_details?.additional_information_required
  );
  const { businessProfileDetails } = useSelector(
    (state) => state.tradingAccount
  );
  const { redirectUrl } = useSelector((state) => state.payment);
  const { stripeBalance } = useSelector((state) => state.payment);
  const { filteredCardList } = useSelector((state) => state.card);
  const { isMakeDefaultCheckboxClear } = useSelector((state) => state.card);

  const [selectedCheckbox, setSelectedCheckbox] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = AuthConsumer();

  // initial api fetch
  useEffect(() => {
    dispatch(getUserDetailApi(id));
    dispatch(getUserBusinessProfileApi());

    if (completed_stripe_onboarding !== 1) {
      dispatch(getStripeConnectApi("user-settings"));
    }

    if (completed_stripe_onboarding === 1) {
      dispatch(getStripeBalanceApi());
    }

    dispatch(listUserCardsApi());
  }, []);

  // isMakeDefaultCheckboxClear
  useEffect(() => {
    if (isMakeDefaultCheckboxClear) {
      dispatch(clearMakeDefaultCheckbox(false));
    }
  }, [isMakeDefaultCheckboxClear]);

  // navigate to edit-user-detail
  const editUserdetailHandler = () => {
    navigate("/edit-user-detail");
  };

  // make card default
  const makeDefaultCardHandler = (cardID) => {
    setSelectedCheckbox(cardID);
    dispatch(defaultCardApi(cardID));
  };

  // delete card modal popup
  const deleteCardModalPopupHandler = (cardID) => {
    let modalConfig = {
      title: "Wait!!",
      message: "Are you sure, you want to delete selected card?",
      shouldRunFunction: true,
      functionHandler: "deleteCardHandler",
      showCancelButton: true,
      shouldCallback: () => deleteCardHandler(cardID),
    };

    dispatch(presentModal(modalConfig));
  };

  // delete selected card
  const deleteCardHandler = (cardID) => {
    dispatch(deleteCardApi(cardID));
  };

  // add a card
  const addCardHandler = () => {
    navigate("/add-card");
  };

  // remove account modal popup
  const removeAccountModalPopupHandler = () => {
    let modalConfig = {
      title: "Wait!!",
      message:
        "Are you sure, you want to remove your account? This cannot be undone!.",
      shouldRunFunction: true,
      functionHandler: "removeAccountHandler",
      showCancelButton: true,
      shouldCallback: () => removeAccountHandler(id),
    };

    dispatch(presentModal(modalConfig));
  };

  // reomve account
  const removeAccountHandler = (id) => {
    dispatch(userAccountDeleteApi(id));
  };

  const usersCCEmail =
    user?.cc_emails?.length > 0
      ? user.cc_emails.map((obj, index) => {
          return (
            <p key={index} className="mb-0">
              {obj}
            </p>
          );
        })
      : null;

  const userCardList =
    filteredCardList?.length > 0
      ? filteredCardList.map((obj, index) => {
          return (
            <div key={index} className="card mb-4">
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-6 col-12 p-0">
                      {obj.cardBrand === "visa" && (
                        <i
                          className="fa fa-cc-visa icon-user-settings pr-4"
                          aria-hidden="true"
                        />
                      )}

                      {obj.cardBrand === "mastercard" && (
                        <i
                          className="fa fa-cc-mastercard icon-user-settings pr-4"
                          aria-hidden="true"
                        />
                      )}

                      {cardLastFourDigitDisplay(obj.cardNumber)}
                    </div>

                    <div className="col-lg-3 col-12 p-lg-0 pl-5 pt-2 m-lg-0 ml-2">
                      {`Exp. ${obj.expiryMonth}/${obj.expiryYear}`}
                    </div>

                    {obj?.defaultCard ? (
                      <div className="col-lg-3 col-12 p-md-0 pt-md-3 pt-lg-0 pt-3">
                        <a className="a-user-settings float-right ml-5 px-2">
                          {obj.defaultCard ? "Default" : ""}
                        </a>
                      </div>
                    ) : (
                      <div className="col-lg-3 col-12 p-md-0 pt-md-3 pt-lg-0 pt-3">
                        <span
                          className="orange"
                          onClick={makeDefaultCardHandler.bind(this, obj.id)}
                        >
                          <input
                            type="checkbox"
                            id="mdCheckbox"
                            name="makeDefault"
                            checked={selectedCheckbox === obj.id ? true : false}
                            readOnly
                          />
                          <label htmlFor="mdCheckbox"> Make default</label>
                        </span>
                        {/* </div> */}

                        <span
                          onClick={deleteCardModalPopupHandler.bind(
                            this,
                            obj.id
                          )}
                        >
                          <FaTrashAlt
                            className="orange trash-u-setting"
                            aria-hidden="true orange"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      : null;
  return (
    <div className="card card-user-settings">
      <div className="card-body py-5">
        <h2 className="title-user-settings pl-3">
          <b>User Settings</b>
        </h2>

        <div className="container">
          {/* Account Info */}
          <div className="row">
            <div className="col-8">
              <h6 className="pt-0 pb-4">
                <b>Account Info</b>
              </h6>
            </div>

            <div className="col-4">
              <a
                className="a-user-settings a-right-user-settings pointer"
                onClick={editUserdetailHandler}
              >
                <i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit
              </a>
            </div>
          </div>

          <div className="row">
            {/* <div className="col-lg-4 col-12">
              <p className="light-user-settings">Username</p>
              <p>_</p>
            </div> */}

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Full Name</p>
              <p>{user.first_name + " " + user.last_name}</p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Email</p>
              <p>{user.email}</p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">CC</p>
              {usersCCEmail}
            </div>
          </div>

          {/* <div className="row">
            <div className="col-lg-4 col-12">
              <p className="light-user-settings">First Name</p>
              <p>{user.first_name}</p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Last Name</p>
              <p>{user.last_name}</p>
            </div>
          </div> */}

          {/* Trading Account Details */}
          <h6 className="py-4">
            <b>Trading Account Details</b>
          </h6>

          <div className="row">
            <div className="col-12 col-lg-4 text-center text-lg-left mb-3">
              <img
                className="orange_avatar"
                src={businessProfileDetails[0]?.avatar}
              />
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Trading Name</p>
              <p>{businessProfileDetails[0]?.trading_name}</p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Trading Address</p>
              <p>{businessProfileDetails[0]?.address_line_1}</p>
              <p>{businessProfileDetails[0]?.address_line_2}</p>
              <p>
                {businessProfileDetails[0]?.city != undefined &&
                  `${businessProfileDetails[0]?.city}, `}

                {businessProfileDetails[0]?.country}
              </p>
              <p>{businessProfileDetails[0]?.post_code}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Company Registration No.</p>
              <p>{businessProfileDetails[0]?.company_registation_number}</p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">VAT Registered</p>
              <p>
                {businessProfileDetails[0]?.vat_registered !== 1 ? "No" : "Yes"}
              </p>
            </div>

            <div className="col-lg-4 col-12">
              <p className="light-user-settings">Contact Number</p>
              <p>{businessProfileDetails[0]?.phone_number}</p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Stripe Connect Details */}
          <div className="row">
            <div className="col-8">
              <h6 className="pt-0 pb-4">
                <b>Stripe Connect Details</b>
              </h6>
            </div>
          </div>

          {completed_stripe_onboarding != 1 ? (
            redirectUrl != "" ? (
              <>
                {!detailsSubmitted &&
                  additionalInformationRequired &&
                  `You don't currently have a Stripe account.`}

                {detailsSubmitted &&
                  additionalInformationRequired &&
                  `Document verification is required in your Stripe account.`}

                <a
                  href={redirectUrl}
                  hrefLang="en"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  target={"_self"}
                  style={{ color: "#ff6100" }}
                >
                  {" "}
                  {!detailsSubmitted &&
                    additionalInformationRequired &&
                    `Please create one.`}
                  {detailsSubmitted &&
                    additionalInformationRequired &&
                    `Proceed from here.`}
                </a>
              </>
            ) : (
              <StripeConnectShimmer />
            )
          ) : (
            <>
              <p>Your current Stripe balance is:</p>

              <div className="row">
                <div className="col-lg-4 col-12">
                  <p className="light-user-settings">Available balance:</p>
                  <p>{`£${stripeBalance.available_balance}`}</p>
                </div>

                <div className="col-lg-4 col-12">
                  <p className="light-user-settings">Pending balance:</p>
                  <p>{`£${stripeBalance.pending_balance}`}</p>
                </div>
              </div>

              <p className="info-user-settings">
                To view your Stripe dashboard please visit{" "}
                <a
                  className="a-user-settings a-underlined-us"
                  href="https://dashboard.stripe.com/login"
                  hrefLang="en"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  target={"_blank"}
                >
                  dashboard.stripe.com
                </a>{" "}
                or download the Stripe mobile app.
              </p>
            </>
          )}

          <hr className="my-4" />

          {/* Payment Methods */}
          <h6 className="pt-0 pb-4">
            <b>Payment Methods</b>
          </h6>

          {userCardList}

          {filteredCardList?.length < 4 && (
            <div
              className="card card-secondary-user-settings"
              onClick={addCardHandler}
            >
              <div className="card-body">
                <i
                  className="fa fa-plus icon-user-settings pr-4 mr-3"
                  aria-hidden="true"
                />
                Add a payment method
              </div>
            </div>
          )}

          <hr className="my-4" />

          {/* Payment Methods */}
          <h6 className="pt-0 pb-4">
            <b>Remove Account</b>
          </h6>

          <p className="info-user-settings pb-3">
            If you would like to remove your account and all associated data
            please use the button below. Note this operation cannot be reversed,
            so please only use this option if you are sure you no longer need
            your account and the associated data.
          </p>

          <button
            type="button"
            className="btn btn-user-settings-btn flamabold mr-2 mb-md-0 mb-4"
            onClick={removeAccountModalPopupHandler}
          >
            REMOVE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export { UserSettings };
