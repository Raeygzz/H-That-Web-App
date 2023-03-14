import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Alert } from "../../components/common";
import { findAddressFromPostcode } from "../../services/axios/Api";
import {
  LabelSchema,
  Address1Schema,
  CitySchema,
  CountrySchema,
  PostcodeSchema,
} from "../../shared/validations/AddAddress";

import "./OnboardingUserAddress.css";

import { useSelector, useDispatch } from "react-redux";
import { onboardingAddAddressApi } from "../../toolkit/features/AddressSlice";

const OnboardingUserAddress = () => {
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);

  const [labelName, setLabelName] = useState("");
  const [labelNameValidate, setLabelNameValidate] = useState(false);

  const [address1, setAddress1] = useState("");
  const [address1Validate, setAddress1Validate] = useState(false);

  const [address2, setAddress2] = useState("");
  const [address2Validate, setAddress2Validate] = useState(false);

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

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const addOnboardingAddressHandler = async (e) => {
    e.preventDefault();

    const validLabelName = await LabelSchema.isValid({ labelName: labelName });
    validLabelName ? setLabelNameValidate(false) : setLabelNameValidate(true);

    const validAddress1 = await Address1Schema.isValid({
      address1: address1,
    });
    validAddress1 ? setAddress1Validate(false) : setAddress1Validate(true);

    const validCity = await CitySchema.isValid({ city: city });
    validCity ? setCityValidate(false) : setCityValidate(true);

    const validCountry = await CountrySchema.isValid({ country: country });
    validCountry ? setCountryValidate(false) : setCountryValidate(true);

    const validPostcode = await PostcodeSchema.isValid({ postcode: postcode });
    validPostcode ? setPostcodeValidate(false) : setPostcodeValidate(true);

    if (latitude == "" && longitude == "") {
      setLatLonValidate(true);
    }

    if (
      validLabelName &&
      validAddress1 &&
      validCity &&
      validCountry &&
      validPostcode &&
      latitude != "" &&
      longitude != ""
    ) {
      let obj = {
        name: labelName,
        address_line_1: address1,
        address_line_2: address2,
        address_line_3: "",
        city: city,
        country: country,
        post_code: postcode,
        latitude: latitude,
        longitude: longitude,
        navigate: navigate,
      };

      dispatch(onboardingAddAddressApi(obj));
    }
  };

  const skipForNowHandler = (e) => {
    e.preventDefault();

    navigate("/search-landing");
  };

  return (
    <div className="onboardingUserAddressWrapper">
      <div className="overlay-onboard">
        <div className="container">
          <div className="row px-0 center">
            <div className="card .card-address">
              <div className="card-body-address pb-2">
                <Alert showError={showError} errorMessage={errorMessage} />

                <h4 className="title-address text-center mt-3">
                  Add User Address Details
                </h4>
                <form
                  className="form-box px-0"
                  onSubmit={addOnboardingAddressHandler}
                >
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="Label name (used to identify in app)"
                      name="labelName"
                      value={labelName}
                      // tabIndex={10}
                      onChange={(e) => setLabelName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="Address line 1"
                      name="address1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="Address line 2"
                      name="address2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="Town/city"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="County"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      className="input-address"
                      type="text"
                      placeholder="Postcode"
                      name="postcode"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value);
                        setPostcodeTyped(true);
                        setLatLonValidate(false);
                        setPostcodeValidate(false);
                      }}
                      required
                    />

                    {!postcodeValidate && latLonValidate ? (
                      <Alert
                        showSuccess={false}
                        showError={true}
                        successMessage=""
                        errorMessage="Invalid postcode. Please try again."
                      />
                    ) : null}
                  </div>
                  <p className="py-2 px-2 p-add">
                    By saving your address details, you allow HIRE
                    <br /> THAT LTD to use your address for future
                    <br /> addresses in accordance with their terms.
                  </p>
                  <button
                    type="submit"
                    className="address-btn btn btn-block text-uppercase"
                  >
                    Add Address
                  </button>
                  <button
                    type="submit"
                    className="btn btn-block btn-hover text-uppercase mt-2 secondary-add-btn"
                    onClick={skipForNowHandler}
                  >
                    Skip for now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OnboardingUserAddress };
