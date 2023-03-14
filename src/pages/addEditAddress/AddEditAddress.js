import React, { useState, useEffect } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./AddEditAddress.css";
import { getObjectLength } from "../../utils";
import { findAddressFromPostcode } from "../../services/axios/Api";

import { useDispatch } from "react-redux";
import {
  addAddressApi,
  updateAddressApi,
} from "../../toolkit/features/AddressSlice";

const AddAddress = (props) => {
  const [labelName, setLabelName] = useState("");
  const [labelNameValidate, setLabelNameValidate] = useState(false);

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine1Validate, setAddressLine1Validate] = useState(false);

  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine2Validate, setAddressLine2Validate] = useState(false);

  const [city, setCity] = useState("");
  const [cityValidate, setCityValidate] = useState(false);

  const [country, setCountry] = useState("");
  const [countryValidate, setCountryValidate] = useState(false);

  const [postcodeTyped, setPostcodeTyped] = useState(false);

  const [postcode, setPostcode] = useState("");
  const [postcodeValidate, setPostcodeValidate] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latLonValidate, setLatLonValidate] = useState(false);

  const [checkBox, setCheckBox] = useState(false);
  const [checkBoxValidate, setCheckBoxValidate] = useState(false);

  const { state } = useLocation();
  // console.log("state ==> ", state);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (getObjectLength(state?.address) != 0) {
      setLabelName(state.address.name);
      setAddressLine1(state.address.address_line_1);
      if (state.address.address_line_2 != null) {
        setAddressLine2(state.address.address_line_2);
      }
      setCity(state.address.city);
      setCountry(state.address.country);
      setPostcode(state.address.post_code);
      setLatitude(state.address.latitude);
      setLongitude(state.address.longitude);
      let checkBoxSelected = state.address.is_primary === 1 ? true : false;
      setCheckBox(checkBoxSelected);
    }
  }, [state?.address]);

  useEffect(() => {
    if (postcodeTyped) {
      setPostcodeTyped(false);
      if (postcode.length >= 6 && postcode.length < 9) {
        findAddressFromPostcode(postcode)
          .then((response) => {
            if (response?.status === 200) {
              setLatitude(response.data.latitude);
              setLongitude(response.data.longitude);
            } else {
              setLatitude("");
              setLongitude("");
            }
          })
          .catch((error) => {
            console.log("error ==> ", error);
          });
      }
    }
  }, [postcodeTyped]);

  const addAddressHandler = (e) => {
    e.preventDefault();

    // let validAddressLine2 = true;

    // const validLabelName = await LabelSchema.isValid({ labelName: labelName });
    // validLabelName ? setLabelNameValidate(false) : setLabelNameValidate(true);

    // const validAddressLine1 = await Address1Schema.isValid({
    //   addressLine1: addressLine1,
    // });
    // validAddressLine1
    //   ? setAddressLine1Validate(false)
    //   : setAddressLine1Validate(true);

    // if (addressLine2 != "") {
    //   validAddressLine2 = await Address2Schema.isValid({
    //     addressLine2: addressLine2,
    //   });
    //   validAddressLine2
    //     ? setAddressLine2Validate(false)
    //     : setAddressLine2Validate(true);
    // }

    // const validCity = await CitySchema.isValid({ city: city });
    // validCity ? setCityValidate(false) : setCityValidate(true);

    // const validCountry = await CountrySchema.isValid({ country: country });
    // validCountry ? setCountryValidate(false) : setCountryValidate(true);

    // const validPostcode = await PostcodeSchema.isValid({ postcode: postcode });
    // validPostcode ? setPostcodeValidate(false) : setPostcodeValidate(true);

    if (latitude == "" && longitude == "") {
      setLatLonValidate(true);
    }

    if (
      // validLabelName &&
      // validAddressLine1 &&
      // validAddressLine2 &&
      // validCity &&
      // validCountry &&
      // validPostcode &&
      latitude != "" &&
      longitude != ""
    ) {
      if (state?.address?.id != undefined && state?.address?.id != "") {
        let obj = {
          _method: "PUT",
          addressId: state?.address?.id,
          navigate: navigate,
          name: labelName,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          address_line_3: "",
          city: city,
          country: country,
          post_code: postcode,
          latitude: latitude,
          longitude: longitude,
          is_primary: checkBox ? "1" : "0",
        };

        dispatch(updateAddressApi(obj));
        //
      } else {
        let obj = {
          navigate: navigate,
          name: labelName,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          address_line_3: "",
          city: city,
          country: country,
          post_code: postcode,
          latitude: latitude,
          longitude: longitude,
          is_primary: checkBox ? "1" : "0",
        };

        dispatch(addAddressApi(obj));
      }
    }
  };

  const goBackHandler = () => {
    navigate("/my-account");
  };

  return (
    <div className="container">
      <div className="row py-4">
        <Link className="back pl-3 mt-5" to="/my-account">
          <FaArrowLeft /> Back to My Account
          {/* <i className="fas fa-arrow-left" /> Back to My Account */}
        </Link>

        <div className="col-12 pt-4">
          <div className="card card-add-address">
            <div className="card-body p-4">
              <h2 className="title-add-address">
                <b>{state?.label ? state.label : "Add"} Address</b>
              </h2>

              <div className="container">
                <form onSubmit={addAddressHandler}>
                  <div className="row pb-3">
                    <div className="col-md-6 col-12 pl-md-0">
                      <div className="form-input">
                        <label htmlFor="labelName">
                          Label name (used to identify in app)
                        </label>

                        <br />

                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="Enter label name"
                          name="labelName"
                          value={labelName}
                          onChange={(e) => setLabelName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row pb-3">
                    <div className="col-md-6 col-12 pl-md-0">
                      <div className="form-input">
                        <label htmlFor="details">Address Details</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="Address Line 1"
                          name="addressLine1"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-12 pr-md-0">
                      <div className="form-input pt-md-4 mt-md-2">
                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="Address Line 2"
                          name="addressLine2"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row pb-3">
                    <div className="col-md-6 col-12 pl-md-0">
                      <div className="form-input">
                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="Town/city"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-12 pr-md-0">
                      <div className="form-input ">
                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="County"
                          name="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row pb-3">
                    <div className="col-md-6 col-12 pl-md-0">
                      <div className="form-input">
                        <input
                          type="text"
                          className="txtbox-add-edit"
                          placeholder="Postcode"
                          name="postcode"
                          value={postcode}
                          onChange={(e) => {
                            setPostcode(e.target.value);
                            setPostcodeTyped(true);
                            setLatLonValidate(false);
                          }}
                          required
                        />
                      </div>

                      {latLonValidate ? (
                        <span style={{ color: "red" }}>
                          Invalid postcode. Please try again.
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    id="terms"
                    defaultValue="read"
                    name="checkBox"
                    checked={checkBox}
                    onChange={(e) => setCheckBox(e.target.checked)}
                  />

                  <label htmlFor="terms">&nbsp;Make this address primary</label>

                  <p className="light-add-address ml-4 pl-1">
                    If marked primary, Hire That app will use this address by
                    default for searches, hiring &amp; delivery.
                  </p>

                  <hr className="my-4" />

                  <div className="container-fluid">
                    <div className="row pb-3">
                      <div className="col-xl-2 col-lg-3 col-md-4 col-12 p-0">
                        <button
                          className="btn btn-add-address btn-primary-add-address"
                          type="submit"
                          value="Submit"
                        >
                          {`${state?.label ? state.label : "ADD"} ADDRESS`}
                        </button>
                      </div>

                      <div className="col-xl-5 col-lg-5 col-md-7 col-12 p-md-0 p-0 pt-3">
                        <button
                          className="btn btn-add-address btn-secondary-add-address"
                          type="submit"
                          value="Submit"
                          onClick={goBackHandler}
                        >
                          DON’T{" "}
                          {`${state?.label ? state.label : "ADD"} ADDRESS`} AND
                          GO BACK
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddAddress };
