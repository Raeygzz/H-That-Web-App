import React from "react";

import { useNavigate } from "react-router-dom";

import "./Modal.css";

import { useSelector, useDispatch } from "react-redux";
import { hideModal } from "../../../toolkit/features/ModalSlice";
import { presentLoader } from "../../../toolkit/features/LoaderSlice";
import { setSelectedTask } from "../../../toolkit/features/BulkUploadSlice";
import { setCreateAdvertIsLoadingComplete } from "../../../toolkit/features/AdvertsSlice";

const Modal = (props) => {
  const { } = props;

  const { data } = useSelector((state) => state.modal);
  const { id } = useSelector((state) => state.auth.user);
  const { modalTitle } = useSelector((state) => state.modal);
  const { modalMessage } = useSelector((state) => state.modal);
  const { showCancelButton } = useSelector((state) => state.modal);
  const { cancelButtonText } = useSelector((state) => state.modal);
  const { okButtonText } = useSelector((state) => state.modal);
  const { shouldLogout } = useSelector((state) => state.modal);
  const { shouldNavigate } = useSelector((state) => state.modal);
  const { navigation } = useSelector((state) => state.modal);
  const { navigateTo } = useSelector((state) => state.modal);
  const { shouldRunFunction } = useSelector((state) => state.modal);
  const { shouldCallback } = useSelector((state) => state.modal);
  const { shouldCallback_2 } = useSelector((state) => state.modal);
  const { functionHandler } = useSelector((state) => state.modal);
  const { cancelButtonFunctionHandler } = useSelector((state) => state.modal);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // cancel button handler
  const cancelButtonHandler = () => {
    dispatch(hideModal());
  };

  // ok button handler
  const okButtonHandler = async () => {
    if (shouldLogout) {
      //
    } else if (shouldNavigate) {
      //
    } else if (shouldRunFunction) {
      // if (functionHandler === "findUserLocationItemsNearMeHandler") {
      //   dispatch(executeFunction_findUserLocationItemsNearMeHandler());
      // }

      if (functionHandler === "findUserLocationItemsNearMeHandler") {
        // shouldCallback != null ? shouldCallback() : null;
        if (shouldCallback != null) {
          dispatch(presentLoader());
          shouldCallback();
        }
      }

      if (functionHandler === "removeAddressHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "findUserPostcodeHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "removeAccountHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "deleteCardHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "cancelHiringHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "clearCalendarDatesHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "navigateToUserDetailScreen") {
        navigate("/edit-user-detail");
      }

      if (functionHandler === "stripeConnectFillUpHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "hireThisItemHandler") {
        if (shouldCallback != null) {
          shouldCallback();
        }
      }

      if (functionHandler === "navigateToBusinessProfileScreen") {
        navigate("/edit-user-detail");
      }

      if (functionHandler === "continueParsingadvert") {
        dispatch(setCreateAdvertIsLoadingComplete(false));
      }

      if (functionHandler === "setSelectedTask") {
        dispatch(setSelectedTask("complete"));
      }

      dispatch(hideModal());
      //
    } else {
      dispatch(hideModal());
    }
  };

  return (
    <div className="overlay">
      <div
        className="alert alert-dismissible fade show alert-saved-address pr-3"
        role="alert"
      >
        <b className="flamabold">{modalTitle}</b>
        <br />
        <hr />

        {/* {modalMessage} */}

        <div dangerouslySetInnerHTML={{ __html: modalMessage }} />

        <br />
        <hr />
        <div className="container">
          <div className="row">
            <div className="col-md-1 col-0" />
            <div className="col-md-4 col-12 p-0 pr-md-1 pb-2">
              {showCancelButton && (
                <button
                  type="button"
                  className="btn btn-secondary-saved-address"
                  onClick={cancelButtonHandler}
                >
                  <b className="b-btn-saved-address">{cancelButtonText}</b>
                </button>
              )}
            </div>
            <div className="col-md-7 col-12 p-0 pl-md-1">
              <button
                type="button"
                className="btn btn-primary-saved-address"
                onClick={okButtonHandler}
              >
                <b className="b-btn-saved-address">{okButtonText}</b>
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true" onClick={cancelButtonHandler}>
            ×
          </span>
        </button>
      </div>
    </div>
  );
};

export { Modal };
