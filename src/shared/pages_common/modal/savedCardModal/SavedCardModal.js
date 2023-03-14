import React from "react";

import "./SavedCardModal.css";
import { cardLastFourDigitDisplay } from "../../../../utils";

import { useSelector, useDispatch } from "react-redux";
import { savedCardModal } from "../../../../toolkit/features/CardSlice";

const SavedCardModal = (props) => {
  const { selectedCardForItem } = props;

  const { filteredCardList } = useSelector((state) => state.card);

  const dispatch = useDispatch();

  // selectedCardHandler
  const selectedCardHandler = (card) => {
    selectedCardForItem(card);
    dispatch(savedCardModal(false));
  };

  const cancelSavedCardModalHandler = () => {
    dispatch(savedCardModal(false));
  };

  const userCardList =
    filteredCardList?.length > 0
      ? filteredCardList.map((obj, index) => {
          return (
            <div
              key={index}
              className="col-6 p-2"
              onClick={selectedCardHandler.bind(this, obj)}
            >
              <div className="card shadow">
                <div className="card-body light-prod-hire">
                  <div className="text-right">
                    &nbsp;
                    <a className="orange">{`${
                      obj.defaultCard ? "Default" : ""
                    }`}</a>
                  </div>

                  <p> {cardLastFourDigitDisplay(obj.cardNumber)}</p>

                  <div>
                    {obj.cardBrand === "visa" && (
                      <i
                        className="fa fa-cc-visa visa-save icon-user-settings pr-4"
                        aria-hidden="true"
                      />
                    )}

                    {obj.cardBrand === "mastercard" && (
                      <i
                        className="fa fa-cc-mastercard icon-user-settings pr-4"
                        aria-hidden="true"
                      />
                    )}

                    <span className="float-right">
                      {`${obj.expiryMonth}/${obj.expiryYear}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      : null;
  return (
    <div className="overlay">
      <div className="card card-saved">
        <div className="card-header header-saved">
          <div className="container">
            <div className="row">
              <div className="col-12 center-saved">
                <b>Saved Cards</b>
              </div>

              <div
                className="position-cross"
                onClick={cancelSavedCardModalHandler}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <h5 className="card-title flamabold pl-2">Select Card</h5>

          <div className="container">
            <div className="row">{userCardList}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SavedCardModal };
