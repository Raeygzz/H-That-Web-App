import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt, FaPlus } from "react-icons/fa";

import "./EditUserDetail.css";
import { RegExp } from "../../utils";
import { AuthConsumer } from "../../contexts";
import { findAddressFromPostcode } from "../../services/axios/Api";

import { useSelector, useDispatch } from "react-redux";
import { putUserDetailApi } from "../../toolkit/features/UserDetailSlice";
import { updateUserBusinessProfileApi } from "../../toolkit/features/TradingAccountSlice";

const EditUserDetail = (props) => {
  const {} = props;

  const emailFromStore = useSelector((state) => state.auth.user.email);
  const { cc_emails } = useSelector((state) => state.auth.user);
  const { first_name } = useSelector((state) => state.auth.user);
  const { last_name } = useSelector((state) => state.auth.user);

  const { addressList } = useSelector((state) => state.address);
  const { addressPickerList } = useSelector((state) => state.address);
  const { businessProfileDetails } = useSelector(
    (state) => state.tradingAccount
  );

  const [businessProfileImage, setBusinessProfileImage] = useState("");
  const [displayBusinessProfileImage, setDisplayBusinessProfileImage] =
    useState("");

  const [email, setEmail] = useState("");
  // const [emailValidate, setEmailValidate] = useState(false);

  const [ccEmails, setCCEmails] = useState([{ key: "", value: "" }]);
  const [ccInvalidEmailsNum, setCCInvalidEmailsNum] = useState(0);
  const [ccEmailsValidate, setCCEmailsValidate] = useState(false);

  const [firstName, setFirstName] = useState("");
  // const [firstNameValidate, setFirstNameValidate] = useState(false);

  const [lastName, setLastName] = useState("");
  // const [lastNameValidate, setLastNameValidate] = useState(false);

  const [readOnly, setReadOnly] = useState(true);
  const [password, setPassword] = useState("");
  // const [passwordValidate, setPasswordValidate] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordValidate, setNewPasswordValidate] = useState(false);

  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordValidate, setConfirmNewPasswordValidate] =
    useState(false);

  const [passwordNotMatchValidate, setPasswordNotMatchValidate] =
    useState(false);

  const [tradingName, setTradingName] = useState("");
  const [tradingNameValidate, setTradingNameValidate] = useState(false);

  // radio button saved / manual address
  const [editUserDetailRadioButtonGroup, setEditUserDetailRadioButtonGroup] =
    useState("savedAddress");
  // const [savedAddressPickerVisible, setSavedAddressPickerVisible] =
  //   useState(false);

  // saved address
  const [savedAddress, setSavedAddress] = useState(true);
  const [savedLabelName, setSavedLabelName] = useState("");
  const [savedAddressLine1, setSavedAddressLine1] = useState("");
  const [savedAddressLine2, setSavedAddressLine2] = useState("");
  const [savedCity, setSavedCity] = useState("");
  const [savedCountry, setSavedCountry] = useState("");
  const [savedPostcode, setSavedPostcode] = useState("");
  const [savedLatitude, setSavedLatitude] = useState("");
  const [savedLongitude, setSavedLongitude] = useState("");

  // manual address
  const [manualAddress, setManualAddress] = useState(false);
  const [manualLabelName, setManualLabelName] = useState("");
  const [manualLabelNameValidate, setManualLabelNameValidate] = useState(false);
  const [manualAddressLine1, setManualAddressLine1] = useState("");
  const [manualAddressLine1Validate, setManualAddressLine1Validate] =
    useState(false);
  const [manualAddressLine2, setManualAddressLine2] = useState("");
  // const [manualaddressLine2Validate, setManualAddressLine2Validate] = useState('');
  const [manualCity, setManualCity] = useState("");
  const [manualCityValidate, setManualCityValidate] = useState(false);
  const [manualCountry, setManualCountry] = useState("");
  const [manualCountryValidate, setManualCountryValidate] = useState(false);
  const [manualPostcode, setManualPostcode] = useState("");
  const [manualPostcodeValidate, setManualPostcodeValidate] = useState(false);
  const [typedPostcode, setTypedPostcode] = useState(false);
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [manualLatLonValidate, setManualLatLonValidate] = useState(false);

  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberValidate, setContactNumberValidate] = useState(false);

  const [companyRegistration, setCompanyRegistration] = useState("");

  const [vatRegister, setVATRegister] = useState(false);

  const [vatNumber, setVATNumber] = useState("");
  const [vatNumberValidate, setVATNumberValidate] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = AuthConsumer();

  // set email
  useEffect(() => {
    if (emailFromStore != "" && emailFromStore != null) {
      setEmail(emailFromStore);
    }
  }, [emailFromStore]);

  // set first_name and last_name
  useEffect(() => {
    if (first_name != "" && first_name != null) {
      setFirstName(first_name);
      setLastName(last_name);
    }
  }, [first_name]);

  useEffect(() => {
    if (cc_emails != "" && cc_emails != null) {
      // console.log("cc_emails ==> ", cc_emails);

      let tempCCEmailsArr = [];
      cc_emails.forEach((item, index) => {
        tempCCEmailsArr.push({
          key: index,
          value: item,
        });
      });

      // console.log('tempCCEmailsArr ==> ', tempCCEmailsArr);
      setCCEmails(tempCCEmailsArr);
    }
  }, [cc_emails]);

  // set manual latitude and longitude
  useEffect(() => {
    if (
      businessProfileDetails.length > 0 &&
      businessProfileDetails[0].is_manual_address === 1
    ) {
      findAddressFromPostcode(businessProfileDetails[0].post_code)
        .then((response) => {
          if (response?.status === 200) {
            setManualLatitude(response.data.latitude.toString());
            setManualLongitude(response.data.longitude.toString());
          } else {
            setManualLatitude("");
            setManualLongitude("");
          }
        })
        .catch((error) => {
          console.log("error ==> ", error);
        });
    }
  }, [businessProfileDetails]);

  // input binding
  useEffect(() => {
    if (businessProfileDetails.length > 0) {
      setDisplayBusinessProfileImage(businessProfileDetails[0].avatar);
      setTradingName(businessProfileDetails[0].trading_name);

      if (businessProfileDetails[0].is_manual_address === 1) {
        setSavedAddress(false);
        setManualAddress(true);
        setManualAddressLine1(businessProfileDetails[0].address_line_1);

        if (businessProfileDetails[0].address_line_2 != null) {
          setManualAddressLine2(businessProfileDetails[0].address_line_2);
        }

        setManualCity(businessProfileDetails[0].city);
        setManualCountry(businessProfileDetails[0].country);
        setManualPostcode(businessProfileDetails[0].post_code);
        setEditUserDetailRadioButtonGroup("manualAddress");
      }

      if (businessProfileDetails[0].is_manual_address === 0) {
        setSavedAddress(true);
        setManualAddress(false);
        setSavedAddressLine1(businessProfileDetails[0].address_line_1);

        if (businessProfileDetails[0].address_line_2 != null) {
          setSavedAddressLine2(businessProfileDetails[0].address_line_2);
        }

        setSavedCity(businessProfileDetails[0].city);
        setSavedCountry(businessProfileDetails[0].country);
        setSavedPostcode(businessProfileDetails[0].post_code);
        addressPickerList.filter((obj) => {
          if (obj.postcode === businessProfileDetails[0].post_code) {
            setSavedLabelName(obj.value);
            setSavedLatitude(obj.lat.toString());
            setSavedLongitude(obj.lon.toString());
          }
        });
        setEditUserDetailRadioButtonGroup("savedAddress");
      }

      setContactNumber(businessProfileDetails[0].phone_number);

      setCompanyRegistration(
        businessProfileDetails[0].company_registation_number
      );
      setVATRegister(
        businessProfileDetails[0].vat_registered === 1 ? true : false
      );

      if (businessProfileDetails[0].vat_registration_number != null) {
        setVATNumber(businessProfileDetails[0].vat_registration_number);
      }
    }
  }, [businessProfileDetails]);

  // uploadBusinessProfileHandler
  const uploadBusinessProfileHandler = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = function () {
      setBusinessProfileImage(reader.result);
      setDisplayBusinessProfileImage(reader.result);
    };

    reader.onerror = function (error) {
      console.log("Error ==> ", error);
    };
  };

  useEffect(() => {
    if (typedPostcode) {
      setTypedPostcode(false);
      if (manualPostcode.length >= 6 && manualPostcode.length < 9) {
        findAddressFromPostcode(manualPostcode)
          .then((response) => {
            if (response?.status === 200) {
              setManualLatitude(response.data.latitude.toString());
              setManualLongitude(response.data.longitude.toString());
            } else {
              setManualLatitude("");
              setManualLongitude("");
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error);
          });
      }
    }
  }, [typedPostcode]);

  // savedAddressPostcodeHandler
  const savedAddressPostcodeHandler = (value) => {
    if (savedAddress && value != "") {
      addressList.filter((obj) => {
        if (obj.name === value) {
          setSavedLabelName(obj.name);
          setSavedAddressLine1(obj.address_line_1);

          if (obj.address_line_2 != null) {
            setSavedAddressLine2(obj.address_line_2);
          }

          setSavedCity(obj.city);
          setSavedCountry(obj.country);
          setSavedPostcode(obj.post_code);
          setSavedLatitude(obj.latitude.toString());
          setSavedLongitude(obj.longitude.toString());
        }
      });
    }
  };

  const saveChangesHandler = (e) => {
    e.preventDefault();

    // USER DETAIL UPDATE
    let ccEmailsArr = [];
    let validCCEmails = true;

    if (ccEmails.length > 0) {
      // console.log("ccEmails ==> ", ccEmails);

      for (let i = 0; i < ccEmails.length; i++) {
        if (ccEmails[i].value != "") {
          ccEmailsArr.push(ccEmails[i].value);
        }

        if (!RegExp.EmailPattern.test(ccEmails[i].value)) {
          if (ccEmails[i].value != "") {
            validCCEmails = false;
            setCCEmailsValidate(true);
            setCCInvalidEmailsNum((prev) => prev + 1);
          }
        }
      }

      // console.log("ccEmailsArr ==> ", ccEmailsArr);
    }

    if (!RegExp.UKMobileNumberPattern.test(contactNumber)) {
      setContactNumberValidate(true);
      return;
    }

    if (validCCEmails) {
      let userInfo = {
        email: email,
        first_name: firstName,
        last_name: lastName,
      };

      let obj = {
        userInfo: userInfo,
        navigate: navigate,
        id: id,
        _method: "PUT",
        email: email,
        cc_emails: ccEmailsArr,
        first_name: firstName,
        last_name: lastName,
      };

      // console.log("obj ==> ", obj);

      if (password !== "") {
        let validNewPassword = RegExp.PasswordPattern.test(newPassword);
        let validConfirmNewPassword =
          RegExp.PasswordPattern.test(confirmNewPassword);

        if (newPassword != "" && validNewPassword) {
          setNewPasswordValidate(false);
        } else {
          setNewPasswordValidate(true);
          return;
        }

        if (confirmNewPassword != "" && validConfirmNewPassword) {
          setConfirmNewPasswordValidate(false);
        } else {
          setConfirmNewPasswordValidate(true);
          return;
        }

        if (newPassword === confirmNewPassword) {
          obj.password = password;
          obj.new_password = newPassword;
          obj.new_password_confirmation = confirmNewPassword;

          dispatch(putUserDetailApi(obj));
          //
        } else {
          setPasswordNotMatchValidate(true);
          return;
        }
      } else {
        dispatch(putUserDetailApi(obj));
      }
    }

    // TRADING ACCOUNT
    if (validCCEmails && savedAddress) {
      let obj = {
        navigate: navigate,
        avatar: businessProfileImage != "" ? businessProfileImage : null,
        trading_name: tradingName,
        name: savedLabelName,
        address_line_1: savedAddressLine1,
        address_line_2: savedAddressLine2,
        city: savedCity,
        country: savedCountry,
        post_code: savedPostcode,
        latitude: savedLatitude,
        longitude: savedLongitude,
        save_this_address: saveThisAddress ? "1" : "0",
        phone_number: contactNumber,
        company_registation_number: companyRegistration,
        vat_registered: vatRegister ? "1" : "0",
        vat_registration_number: vatRegister ? vatNumber : "",
        is_manual_address: manualAddress ? "1" : "0",
      };

      // console.log("saved address obj ==>", obj);
      dispatch(updateUserBusinessProfileApi(obj));
    }

    if (validCCEmails && manualAddress) {
      if (manualLatitude === "" && manualLongitude === "") {
        setManualLatLonValidate(true);
        return;
      }

      if (manualLatitude != "" && manualLongitude != "") {
        let obj = {
          navigate: navigate,
          avatar: businessProfileImage != "" ? businessProfileImage : null,
          trading_name: tradingName,
          name: manualLabelName,
          address_line_1: manualAddressLine1,
          address_line_2: manualAddressLine2,
          city: manualCity,
          country: manualCountry,
          post_code: manualPostcode,
          latitude: manualLatitude,
          longitude: manualLongitude,
          save_this_address: saveThisAddress ? "1" : "0",
          phone_number: contactNumber,
          company_registation_number: companyRegistration,
          vat_registered: vatRegister ? "1" : "0",
          vat_registration_number: vatRegister ? vatNumber : "",
          is_manual_address: manualAddress ? "1" : "0",
        };

        // console.log("manual address obj ==>", obj);
        dispatch(updateUserBusinessProfileApi(obj));
      }
    }
  };

  const discardAndGoBackHandler = (e) => {
    e.preventDefault();

    navigate(-1);
  };

  const addAdditionalEmailHandler = () => {
    const _ccEmails = [...ccEmails];
    _ccEmails.push({ key: "", value: "" });
    setCCEmails(_ccEmails);
  };

  const deleteHandler = (key) => {
    const _ccEmails = ccEmails.filter((input, index) => index != key);
    setCCEmails(_ccEmails);
  };

  const inputHandler = (text, key) => {
    const _ccEmails = [...ccEmails];
    _ccEmails[key].value = text.trim();
    _ccEmails[key].key = key;
    setCCEmails(_ccEmails);
  };

  const inputFields =
    ccEmails.length > 0
      ? ccEmails.map((input, key) => {
          // console.log("input ==> ", input);
          // console.log("key ==> ", key);

          return (
            <div key={key}>
              <input
                type="text"
                className="txtbox"
                // placeholder="patty@carlsrigemporium.co.uk"
                name="ccEmails"
                value={input.value}
                onChange={(e) => {
                  e.preventDefault();
                  inputHandler(e.target.value, key);
                  setCCInvalidEmailsNum(0);
                  setCCEmailsValidate(false);
                }}
              />

              <FaTrashAlt
                className="orange trash"
                aria-hidden="true orange"
                onClick={deleteHandler.bind(this, key)}
              />

              {key + 1 == ccEmails.length && <hr />}
            </div>
          );
        })
      : null;

  return (
    <div className="container">
      <div className="row py-4">
        <a
          className="a-edit-user a-underline pl-3 mt-5 pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft color="#ff6100" /> Back to My Account
        </a>

        <div className="col-12 pt-4">
          <div className="card card-edit-user">
            <div className="card-body p-4 m-2">
              <h2 className="title-edit-user">
                <b>Edit User Details</b>
              </h2>

              <form onSubmit={saveChangesHandler}>
                <div className="container p-0">
                  {/* Account Info */}
                  <div className="row pb-3">
                    <div className="col-12">
                      <h5 className="pb-4">
                        <b>Account Info</b>
                      </h5>
                    </div>

                    {/* <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-input">
                      <label htmlFor="labelName">Username</label>
                      <br />
                      <input
                        type="text"
                        className="txtbox"
                        placeholder="carl.shenton.diggers"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div> */}

                    <div className="col-lg-4 col-md-6 col-12 pt-md-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Email</label>
                        <br />
                        <input
                          type="email"
                          className="txtbox"
                          // placeholder="carl@carlsrigemporium.co.uk"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">CC</label>

                        <br />

                        {inputFields}

                        {/* <input
                        type="text"
                        className="txtbox"
                        placeholder="patty@carlsrigemporium.co.uk"
                        name="ccEmails"
                        value={ccEmails}
                        onChange={(e) => setCCEmails(e.target.value)}
                        required
                      />

                      <i
                        className="fa fa-trash trash-edit-user orange"
                        aria-hidden="true orange"
                      /> */}

                        {ccEmailsValidate && (
                          <p style={{ color: "red" }}>
                            {`${ccInvalidEmailsNum} - invalid email, Please check your Cc email addresses`}
                          </p>
                        )}

                        <a
                          className="a-edit-user pb-3 orange"
                          onClick={addAdditionalEmailHandler}
                        >
                          <FaPlus color="#ff6100" /> Add additional email
                        </a>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">First Name</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox"
                          // placeholder="Carl"
                          name="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Last Name</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox"
                          // placeholder="Shenton"
                          name="firstName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Change Password */}
                  <div className="row pb-3">
                    <div className="col-12">
                      <h5 className="pb-4">
                        <b>Change Password</b>
                      </h5>
                    </div>

                    <div className="col-lg-4 col-md-12 col-12">
                      <div className="form-input">
                        <label htmlFor="labelName">Current Password</label>

                        <br />

                        <input
                          type="password"
                          className="txtbox"
                          // placeholder="Enter current password"
                          name="firstName"
                          value={password}
                          readOnly={readOnly}
                          onFocus={() => setReadOnly(false)}
                          onBlur={() => setReadOnly(true)}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">New Password</label>

                        <br />

                        <input
                          type="password"
                          className="txtbox"
                          // placeholder="Enter new password"
                          name="newPassword"
                          value={newPassword}
                          readOnly={readOnly}
                          onFocus={() => setReadOnly(false)}
                          onBlur={() => setReadOnly(true)}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setNewPasswordValidate(false);
                            setConfirmNewPasswordValidate(false);
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Confirm New Password</label>

                        <br />

                        <input
                          type="password"
                          className="txtbox"
                          // placeholder="Enter confirm new password"
                          name="confirmNewPassword"
                          value={confirmNewPassword}
                          readOnly={readOnly}
                          onFocus={() => setReadOnly(false)}
                          onBlur={() => setReadOnly(true)}
                          onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                            setNewPasswordValidate(false);
                            setConfirmNewPasswordValidate(false);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {newPasswordValidate && (
                    <p style={{ color: "red" }}>
                      {"Please enter valid new password"}
                    </p>
                  )}

                  {confirmNewPasswordValidate && (
                    <p style={{ color: "red" }}>
                      {"Please enter valid confirm new password"}
                    </p>
                  )}

                  {passwordNotMatchValidate && (
                    <p style={{ color: "red" }}>{"Passwords do not match"}</p>
                  )}

                  <hr className="my-4" />

                  {/* Trading Account Details */}
                  <div className="row pb-3">
                    <div className="col-12">
                      <h5 className="pb-4">
                        <b>Trading Account Details</b>
                      </h5>
                    </div>

                    <div className="col-12 col-lg-2 col-md-4 text-center mb-3">
                      <label htmlFor="avatar">
                        <div className="orange_avatar">
                          {displayBusinessProfileImage != "" && (
                            <img
                              className="orange_avatar"
                              src={displayBusinessProfileImage}
                            />
                          )}
                        </div>
                      </label>

                      <input
                        className="hidden"
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={(e) => {
                          uploadBusinessProfileHandler(e);
                        }}
                      />
                    </div>
                    <div className="col-12 col-lg-10 col-md-8">
                      <p>
                        Upload an image of yourself or your business logo to
                        show it on items you offer for <br /> hire &amp; sale
                      </p>
                    </div>

                    <div className="col-lg-6 col-md-12 col-12">
                      <div className="form-input">
                        <label htmlFor="labelName">Trading Name</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox"
                          // placeholder="Carl’s Rig Emporium"
                          name="tradingName"
                          value={tradingName}
                          onChange={(e) => setTradingName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Contact Number</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox"
                          // placeholder="+44 07123 567890"
                          name="contactNumber"
                          value={contactNumber}
                          onChange={(e) => {
                            setContactNumber(e.target.value);
                            setContactNumberValidate(false);
                          }}
                          required
                        />
                      </div>

                      {contactNumberValidate && (
                        <p style={{ color: "red" }}>
                          Contact number is not valid.
                        </p>
                      )}
                    </div>

                    <br />
                    <br />
                    <div className="col-lg-6 col-md-12 col-12 pt-lg-0 pt-3">
                      <br />
                      <label htmlFor="labelName">Trading Address</label>

                      <div className="form-input">
                        <input
                          type="radio"
                          name="editUserDetailRadio"
                          id="editUserSaved"
                          value={editUserDetailRadioButtonGroup}
                          onChange={(e) => {
                            setSavedAddress(true);
                            setManualAddress(false);
                            setEditUserDetailRadioButtonGroup("savedAddress");
                          }}
                          checked={
                            editUserDetailRadioButtonGroup == "savedAddress"
                          }
                        />
                        <label htmlFor="editUserSaved">Saved Address</label>

                        <input
                          type="radio"
                          className="ml-5"
                          name="editUserDetailRadio"
                          id="editUserManual"
                          value={editUserDetailRadioButtonGroup}
                          onChange={(e) => {
                            setSavedAddress(false);
                            setManualAddress(true);
                            setEditUserDetailRadioButtonGroup("manualAddress");
                          }}
                          checked={
                            editUserDetailRadioButtonGroup == "manualAddress"
                          }
                        />
                        <label htmlFor="editUserManual">Manual Address</label>

                        {/*--------------- for saved address ---------------*/}
                        {savedAddress && !manualAddress && (
                          <div className="select mt-3">
                            <select
                              //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                              value={savedLabelName}
                              onChange={(e) => {
                                setSavedLabelName(e.target.value);
                                savedAddressPostcodeHandler(e.target.value);
                              }}
                              required
                            >
                              {addressPickerList.map((obj, index) => {
                                return (
                                  <option key={index} value={obj.value}>
                                    {obj.label}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}

                        <br />

                        {/*--------------- for manual address ---------------*/}
                        {!savedAddress && manualAddress && (
                          <>
                            <input
                              type="text"
                              className="txtbox"
                              // placeholder="Address Line 1"
                              name="manualAddressLine1"
                              value={manualAddressLine1}
                              onChange={(e) =>
                                setManualAddressLine1(e.target.value)
                              }
                              required
                            />

                            <input
                              type="text"
                              className="txtbox"
                              // placeholder="Address Line 2"
                              name="manualAddressLine2"
                              value={manualAddressLine2}
                              onChange={(e) =>
                                setManualAddressLine2(e.target.value)
                              }
                            />

                            <input
                              type="text"
                              className="txtbox"
                              // placeholder="Topsham"
                              name="manualCity"
                              value={manualCity}
                              onChange={(e) => setManualCity(e.target.value)}
                              required
                            />

                            <input
                              type="text"
                              className="txtbox"
                              // placeholder="County"
                              name="manualCountry"
                              value={manualCountry}
                              onChange={(e) => setManualCountry(e.target.value)}
                              required
                            />

                            <input
                              type="text"
                              className="txtbox"
                              // placeholder="Postcode"
                              name="manualPostcode"
                              value={manualPostcode}
                              onChange={(e) => {
                                setManualPostcode(e.target.value);
                                setTypedPostcode(true);
                                setManualLatLonValidate(false);
                              }}
                              required
                            />

                            {manualLatLonValidate && (
                              <p style={{ color: "red" }}>
                                {`Invalid latitude & longitude. Please type again your postcode.`}
                              </p>
                            )}

                            {saveThisAddress && (
                              <input
                                type="text"
                                className="txtbox"
                                // placeholder="Label name (used to identify in app)"
                                name="manualLabelName"
                                value={manualLabelName}
                                onChange={(e) =>
                                  setManualLabelName(e.target.value)
                                }
                                required
                              />
                            )}

                            <input
                              type="checkbox"
                              id="saveThisAddress"
                              name="saveThisAddress"
                              checked={saveThisAddress}
                              onChange={(e) =>
                                setSaveThisAddress(e.target.checked)
                              }
                            />

                            <label htmlFor="saveAddress">
                              Save this address
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-input">
                        <label htmlFor="labelName">
                          Company Registration No. (Optional)
                        </label>
                        <br />
                        <input
                          type="text"
                          className="txtbox"
                          // placeholder="01930472"
                          name="companyRegistration"
                          value={companyRegistration}
                          onChange={(e) =>
                            setCompanyRegistration(e.target.value)
                          }
                          // required
                        />
                      </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-12 pt-4 mt-lg-3 mt-0">
                      <div className="form-input">
                        <input
                          type="checkbox"
                          id="Vat Register"
                          name="vatRegister"
                          checked={vatRegister}
                          onChange={(e) => setVATRegister(e.target.checked)}
                        />

                        <label htmlFor="Vat Register">VAT Registered</label>

                        {/* <label htmlFor="labelName">VAT Registered</label>
                      <br />
                      <input
                        type="radio"
                        name="vatRegister"
                        defaultValue="yes"
                      />
                      <label htmlFor="all">Yes</label>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input
                        type="radio"
                        name="vatRegister"
                        defaultValue="no"
                      />
                      <label htmlFor="forhire">No</label> */}
                      </div>
                    </div>

                    {vatRegister && (
                      <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-input">
                          <label htmlFor="labelName">VAT Number</label>
                          <br />
                          <input
                            type="text"
                            className="txtbox"
                            // placeholder="01930472"
                            name="vatNumber"
                            value={vatNumber}
                            onChange={(e) => setVATNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="my-4" />

                  <span style={{ color: "#616161" }}>
                    If <b>VAT Registered</b> is not ticked any hires from this
                    account will not be charged VAT and therefore will leave the
                    account holder liable for the VAT element of a hire that the
                    hirer would not be charged.
                  </span>

                  <hr className="my-4" />

                  <div className="container">
                    <div className="row pb-3">
                      <div className="col-xl-2 col-lg-3 col-md-4 col-12 pr-md-3 p-0">
                        <button
                          className="btn btn-edit-user btn-primary-edit-user"
                          type="submit"
                          value="Submit"
                        >
                          SAVE CHANGES
                        </button>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-7 col-12 p-0 pt-md-0 pt-3">
                        <button
                          className="btn btn-edit-user btn-secondary-edit-user"
                          type="submit"
                          value="Submit"
                          onClick={discardAndGoBackHandler}
                        >
                          DISCARD CHANGES AND GO BACK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EditUserDetail };
