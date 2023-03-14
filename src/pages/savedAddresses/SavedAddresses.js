import React from "react";

import { useNavigate, Link } from "react-router-dom";

import { FaEdit, FaTrashAlt } from "react-icons/fa";

import "./SavedAddresses.css";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { deleteAddressApi } from "../../toolkit/features/AddressSlice";

const SavedAddresses = (props) => {
  const {} = props;

  const { addressList } = useSelector((state) => state.address);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // addAddressHandler
  const addAddressHandler = () => {
    navigate("/address");
  };

  // modalPopupHandler
  const modalPopupHandler = (id) => {
    let addressItemName = addressList.filter((obj) => {
      if (obj.id == id) return obj.name;
    });

    let modalConfig = {
      title: "Wait!",
      message: `Are you sure you want to remove ${addressItemName[0].name} from your saved addresses? This cannot be undone!`,
      shouldRunFunction: true,
      showCancelButton: true,
      functionHandler: "removeAddressHandler",
      shouldCallback: () => removeAddressHandler(id),
    };

    dispatch(presentModal(modalConfig));
  };

  // removeAddressHandler
  const removeAddressHandler = (id) => {
    dispatch(deleteAddressApi(id));
  };

  const addressListItem =
    addressList.length > 0
      ? addressList.map((obj, index) => {
          if (obj.is_primary != 1) {
            return (
              <div key={index}>
                <p>
                  <b>{obj.name}</b>
                  <br />
                  <br />
                  {obj.address_line_1}

                  {obj.address_line_2 != null && (
                    <>
                      <br />
                      <br />
                      {obj.address_line_2}
                    </>
                  )}
                  <br />
                  <br />
                  {obj.city}
                  <br />
                  <br />
                  {obj.post_code}
                </p>
                <Link
                  to="/address"
                  state={{ label: "EDIT", address: obj }}
                  className="a-saved-address"
                >
                  <FaEdit />{" "}
                  {/* <i className="fa-solid fa-pen-to-square i-active-saved-address" />{" "} */}
                  Edit
                </Link>
                &nbsp; &nbsp;
                <a
                  className="a-saved-address"
                  onClick={modalPopupHandler.bind(this, obj.id)}
                >
                  <FaTrashAlt />{" "}
                  {/* <i className="fa-solid fa-trash-can i-active-saved-address" />{" "} */}
                  Remove
                </a>
                {index + 1 < addressList.length && <hr className="my-4" />}
              </div>
            );
          }
        })
      : null;
  return (
    <div className="card card-saved-address">
      <div className="card-body py-5">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 col-12">
              <h2 className="title-saved-address">
                <b>Saved Addresses</b>
              </h2>
            </div>
            <div className="col-lg-3 col-12">
              <button
                type="button"
                className="btn btn-primary-saved-address mb-4"
                onClick={addAddressHandler}
              >
                <b className="b-btn-saved-address">ADD ADDRESS</b>
              </button>
            </div>
          </div>

          {/* primary address */}
          <div className="row">
            <div className="col-lg-6 col-12">
              <h5 className="pt-0 pb-4">
                <b>Primary Address</b>
              </h5>
              <p className="light-saved-address">
                This address will be used by default for searches, hiring &amp;
                delivery.
              </p>
            </div>
            <div className="col-lg-6 col-12">
              <p>
                <b>{addressList[0]?.name}</b>
                <br />
                <br />
                {addressList[0]?.address_line_1}
                {addressList[0]?.address_line_2 != null && (
                  <>
                    <br />
                    <br />
                    {addressList[0]?.address_line_2}
                  </>
                )}
                <br />
                <br />
                {addressList[0]?.city != undefined &&
                  `${addressList[0]?.city}, `}{" "}
                {addressList[0]?.country}
                <br />
                <br />
                {addressList[0]?.post_code}
              </p>

              {addressList.length > 0 && (
                <Link
                  to="/address"
                  state={{ label: "EDIT", address: addressList[0] }}
                  className="a-saved-address"
                >
                  <FaEdit /> Edit
                </Link>
              )}
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="container">
          {/* Other Addresses */}
          <div className="row">
            <div className="col-lg-6 col-12">
              <h5 className="pt-0 pb-4">
                <b>Other Addresses</b>
              </h5>
            </div>
            <div className="col-lg-6 col-12">{addressListItem}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SavedAddresses };
