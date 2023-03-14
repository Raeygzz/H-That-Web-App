import React from "react";

import "./NeedFinanceModal.css";

const NeedFinanceModal = (props) => {
  const { cancelNeedFinanceModal } = props;

  // cancelNeedFinanceModalHandler
  const cancelNeedFinanceModalHandler = () => {
    cancelNeedFinanceModal(false);
  };

  // doneHandler
  const doneHandler = () => {
    cancelNeedFinanceModal(false);
  };

  return (
    <div className="overlay">
      <div className="card card-finance">
        <div className="card-header header-saved">
          <div className="container">
            <div className="row">
              <div className="col-12 center-saved">
                <b>Need finance?</b>
              </div>

              <div
                className="position-cross pointer"
                onClick={cancelNeedFinanceModalHandler}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="container">
            <div className="needFinanceBG text-center">
              <img
                className="col-6 needFinanceimg"
                alt="logo"
                src={require("../../../../assets/images/logo.png")}
              />

              <p className="flamabold moneyOrange">MONEY</p>
            </div>

            <div>
              <p className="text-center my-4">
                <b>
                  Contact us now for a free, <br />
                  no-obligation quote on 03332420310
                </b>
              </p>

              <button
                type="button"
                className="btn btn-prod-hire1 m-0"
                onClick={doneHandler}
              >
                <b>DONE</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NeedFinanceModal };
