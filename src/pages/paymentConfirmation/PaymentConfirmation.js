import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import "./PaymentConfirmation.css";

import { useSelector } from "react-redux";

const PaymentConfirmation = (props) => {
  const {} = props;

  const { hireItemStripeCostDetail } = useSelector((state) => state.payment);
  // console.log("hireItemStripeCostDetail ==> ", hireItemStripeCostDetail);

  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log("state ==> ", state);

  const continueHandler = () => {
    navigate("/my-account/account-overview", { replace: true });
  };

  return (
    <div className="card card-comfirm-pay shadow">
      <div className="card-header header-comfirm-pay">
        <div className="container">
          <div className="row">
            <div className="col-12 text-mid">
              <b className="b-pay">Payment Confirmation</b>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <h5 className="card-title text-center font-20">
          <span className="orange-no-pointer">
            <i className="fa fa-check" aria-hidden="true" />
          </span>
          &nbsp;
          <b>PAYMENT CONFIRMED</b>
        </h5>

        <div className="text-center">
          You'll recieve a reciept for your purchase on email shortly.
          <br />
          Charge will show on your account as HT Hire.
        </div>

        <div className="container px-5 pt-4">
          <div className="row">
            <div className="col-6">{state.name}</div>
            <div className="col-6 light-prod-hire">{state.daysDuration}</div>
          </div>

          <div className="row">
            <div className="col-6">Hire Price</div>
            <div className="col-6 light-prod-hire">
              {hireItemStripeCostDetail.hire_price}
            </div>
          </div>

          <div className="row">
            <div className="col-6">Delivery Price</div>
            <div className="col-6 light-prod-hire">
              {hireItemStripeCostDetail.delivery_price}
            </div>
          </div>

          <div className="row">
            <div className="col-6">Admin Fee</div>
            <div className="col-6 light-prod-hire">
              {hireItemStripeCostDetail.admin_fee_stripe}
            </div>
          </div>

          {hireItemStripeCostDetail.vat !== 0 && (
            <div className="row">
              <div className="col-6">VAT</div>
              <div className="col-6 light-prod-hire">
                {hireItemStripeCostDetail.vat}
              </div>
            </div>
          )}

          <div className="row pt-3">
            <div className="col-6">
              <b>Total Paid</b>
            </div>

            <div className="col-6">
              <b className="pounds-font">
                £{hireItemStripeCostDetail.total_paid} GBP
              </b>
            </div>
          </div>

          <img
            src={require("../../assets/images/stripe.png")}
            alt="Powered by Stripe"
            className="mx-auto d-block stripe-img"
          />
        </div>
        <div className="container-fluid">
          <div className="row pt-3">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-comfirm-pay"
                onClick={continueHandler}
              >
                <b className="b-btn-comfirm-pay">Continue</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentConfirmation };
