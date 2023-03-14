import React, { useState, useEffect } from "react";

import Geocode from "react-geocode";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./SearchLanding.css";
import { Distance } from "../../constants";
import { AuthConsumer } from "../../contexts";
import { useDeviceDetect } from "../../hooks";
import { getObjectLength } from "../../utils";
import { Alert } from "../../components/common";
import { conditionCheck } from "../../shared/models";
import { findAddressFromPostcode } from "../../services/axios/Api";
import {
  LatitudeSchema,
  LongitudeSchema,
} from "../../shared/validations/SearchLanding";

import { useSelector, useDispatch } from "react-redux";
import { setError } from "../../toolkit/features/ErrorSlice";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { addressListApi } from "../../toolkit/features/AddressSlice";
import { getUserDetailApi } from "../../toolkit/features/UserDetailSlice";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";
import {
  categoriesApi,
  subCategoriesApi,
} from "../../toolkit/features/CategoriesSlice";
import {
  // searchItemApi,
  filterSearchItemApi,
  nearMeApi,
} from "../../toolkit/features/SearchLandingSlice";

const SearchLanding = (props) => {
  const {} = props;

  const { email } = useSelector((state) => state.auth.user);
  const { has_primary_address } = useSelector((state) => state.auth.user);
  const { has_business_profile } = useSelector((state) => state.auth.user);
  // const { completed_stripe_onboarding } = useSelector((state) => state.auth.user);
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);

  const [searchTerm, setSearchTerm] = useState("");

  const [postcode, setPostcode] = useState("");

  const [SLTypedPostcode, setSLTypedPostcode] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [latitudeValidate, setLatitudeValidate] = useState(false);

  const [longitude, setLongitude] = useState("");
  const [longitudeValidate, setLongitudeValidate] = useState(false);

  const [miles, setMiles] = useState("Unlimited");

  const { id } = AuthConsumer();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectBrowserName } = useDeviceDetect();

  useEffect(() => {
    dispatch(getUserDetailApi(id));
    dispatch(categoriesApi());
    dispatch(subCategoriesApi(1));

    if (has_primary_address === 1) {
      dispatch(addressListApi());
    }

    let searchData = JSON.parse(localStorage.getItem("searchData"));

    if (getObjectLength(searchData) != 0) {
      setPostcode(searchData.post_code);
      setLatitude(searchData.latitude);
      setLongitude(searchData.longitude);
      setMiles(searchData.distance != null ? searchData.distance : "Unlimited");
    }
  }, []);

  useEffect(() => {
    if (SLTypedPostcode) {
      setSLTypedPostcode(false);
      if (postcode.length >= 6 && postcode.length < 9) {
        findAddressFromPostcode(postcode)
          .then((response) => {
            if (response?.status === 200) {
              setLatitude(response.data.latitude);
              setLongitude(response.data.longitude);
              //
            } else {
              setLatitude("");
              setLongitude("");
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error);
          });
      }
    }
  }, [SLTypedPostcode]);

  // geolocation options
  let geoOps = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  // geolocation successCallback
  function successCallback(position) {
    // console.log("position ==> ", position);

    const { latitude, longitude, accuracy } = position.coords;
    // console.log("accuracy ==> ", accuracy);

    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
    setLatitude(latitude);
    setLongitude(longitude);

    // Geocode.fromLatLng(50.695874, -3.537021)
    Geocode.fromLatLng(latitude, longitude).then(
      (json) => {
        // console.log("json ==> ", json);

        let addressComponent = json.results[0].address_components;
        // console.log("addressComponent ==> ", addressComponent);

        addressComponent.filter((obj) => {
          if (obj?.types) {
            setPostcode("");
            if (obj.types[0] === "postal_code") {
              setPostcode(obj.long_name);
            }
          }
        });

        dispatch(hideLoader());
      },

      (error) => {
        dispatch(hideLoader());
        console.error(error);
      }
    );
  }

  // geolocation errorCallback
  function errorCallback(err) {
    dispatch(hideLoader());
    console.warn(`ERROR ==> (${err.code}): ${err.message}`);
    // console.error("Error Code = " + error.code + " - " + error.message);
  }

  // useEffect(() => {
  //   const readLocation = () => {
  //     if (navigator.geolocation) {
  //       const geoId = navigator.geolocation.watchPosition(
  //         (position) => {
  //           const { latitude, longitude, accuracy } = position.coords;
  //           console.log("watchPosition ==> ", {
  //             lat: latitude,
  //             lng: longitude,
  //             accuracy: accuracy,
  //           });

  //           if (position.coords.accuracy > 10) {
  //             console.log("== The GPS accuracy isn't good enough ==");
  //           }
  //         },
  //         (e) => {
  //           console.log("Error ==> ", e);
  //         },
  //         { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
  //       );

  //       return () => {
  //         console.log("Clear watch called");
  //         window.navigator.geolocation.clearWatch(geoId);
  //       };
  //     }

  //     return;
  //   };

  //   readLocation();
  // }, []);

  // findUserPostcodeHandler
  const findUserPostcodeHandler = () => {
    dispatch(presentLoader());

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      geoOps
    );

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log("position ==> ", position);

    //     Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
    //     setLatitude(position.coords.latitude);
    //     setLongitude(position.coords.longitude);

    //     // Geocode.fromLatLng(50.695874, -3.537021)
    //     Geocode.fromLatLng(
    //       position.coords.latitude,
    //       position.coords.longitude
    //     ).then(
    //       (json) => {
    //         let addressComponent = json.results[0].address_components;
    //         addressComponent.filter((obj) => {
    //           if (obj?.types) {
    //             setPostcode("");
    //             if (obj.types[0] === "postal_code") {
    //               setPostcode(obj.long_name);
    //             }
    //           }
    //         });

    //         dispatch(hideLoader());
    //       },

    //       (error) => {
    //         dispatch(hideLoader());
    //         console.error(error);
    //       }
    //     );
    //   },

    //   (error) => {
    //     dispatch(hideLoader());
    //     // console.error("Error Code = " + error.code + " - " + error.message);
    //   }
    // );
  };

  // myPostcodeHandler
  const myPostcodeHandler = (e) => {
    e.preventDefault();

    if (projectBrowserName === "Chrome") {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state === "granted") {
              findUserPostcodeHandler();
              //
            } else if (result.state === "prompt") {
              let modalConfig = {
                title: "User Location Access",
                message: "Please 'Allow' to access your location.",
                okButtonText: "Ok",
                showCancelButton: true,
                cancelButtonText: "NEVER MIND",
                shouldRunFunction: true,
                functionHandler: "findUserPostcodeHandler",
                shouldCallback: () => findUserPostcodeHandler(),
              };

              dispatch(presentModal(modalConfig));
              //
            } else if (result.state === "denied") {
              // console.log("denied ==> ", result.state);
              //If denied then you have to show instructions to enable location

              let modalConfig = {
                title: "Oops!",
                message:
                  "Please give access to the location in your browser as it is denied for now.",
              };

              dispatch(presentModal(modalConfig));
            }
            result.onchange = function () {
              // console.log("onchange ==> ", result.state);
            };
          });
      } else {
        let modalConfig = {
          title: "Sorry!",
          message: "User Location Access Is Not available.",
        };

        dispatch(presentModal(modalConfig));
      }
    }

    if (projectBrowserName === "Safari") {
      let modalConfig = {
        title: "Sorry!",
        message: "User Location Access Is Not available.",
      };

      dispatch(presentModal(modalConfig));
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();

    const validLatitude = await LatitudeSchema.isValid({ latitude: latitude });
    validLatitude ? setLatitudeValidate(false) : setLatitudeValidate(true);

    const validLongitude = await LongitudeSchema.isValid({
      longitude: longitude,
    });
    validLongitude ? setLongitudeValidate(false) : setLongitudeValidate(true);

    if (postcode.length < 6 || postcode.length > 8) {
      let alertConfig = {
        showError: true,
        errorMessage: "Please enter valid Postcode.",
      };

      dispatch(setError(alertConfig));
      return;
    }

    if (
      postcode.length >= 6 &&
      postcode.length < 9 &&
      !validLatitude &&
      !validLongitude
    ) {
      let alertConfig = {
        showError: true,
        errorMessage: "Invalid Postcode. Please try again.",
      };

      dispatch(setError(alertConfig));
      return;
    }

    if (
      postcode.length >= 6 &&
      postcode.length < 9 &&
      validLatitude &&
      validLongitude
    ) {
      let obj = {
        page: 1,
        navigate: navigate,
        keyword: searchTerm.trim(),
        post_code: postcode,
        latitude: latitude,
        longitude: longitude,
        distance: miles === "Unlimited" ? null : parseInt(miles),
        item_type: "all",
        category_id: "",
        sub_category_id: "",
        min_price: "",
        max_price: "",
        sort_by: null,
      };

      localStorage.setItem(
        "searchData",
        JSON.stringify({
          keyword: searchTerm.trim(),
          post_code: postcode,
          latitude: latitude,
          longitude: longitude,
          distance: miles === "Unlimited" ? null : parseInt(miles),
        })
      );

      // dispatch(searchItemApi(obj));
      dispatch(filterSearchItemApi(obj));
    }
  };

  useEffect(() => {
    if (showError) {
      let errorConfig = {
        errorMessage: "",
        showError: false,
      };

      setTimeout(() => {
        dispatch(setError(errorConfig));
      }, 1500);
    }
  }, [showError]);

  const searchNearMeHandler = (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            // console.log("granted ==> ", result.state);
            dispatch(presentLoader());
            findUserLocationItemsNearMeHandler();
            //
          } else if (result.state === "prompt") {
            // console.log("prompt ==> ", result.state);
            let modalConfig = {
              title: "User Location Access",
              message: "Please 'Allow' to access your location.",
              okButtonText: "Ok",
              showCancelButton: true,
              cancelButtonText: "NEVER MIND",
              shouldRunFunction: true,
              functionHandler: "findUserLocationItemsNearMeHandler",
              shouldCallback: () => findUserLocationItemsNearMeHandler(),
            };

            dispatch(presentModal(modalConfig));
            //
          } else if (result.state === "denied") {
            // console.log("denied ==> ", result.state);
            //If denied then you have to show instructions to enable location

            let modalConfig = {
              title: "Oops!",
              message:
                "Please give access to the location in your browser as it is denied for now.",
            };

            dispatch(presentModal(modalConfig));
          }

          result.onchange = function () {
            // console.log("onchange ==> ", result.state);
            if (result.state === "denied") {
              dispatch(hideLoader());
            }
          };
        });
    } else {
      console.log("Sorry! User Location Access Is Not available.");
    }
  };

  // findUserLocationItemsNearMeHandler
  const findUserLocationItemsNearMeHandler = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("position ==> ", position);

        let obj = {
          page: 1,
          navigate: navigate,
          // latitude: 50.695874,
          // longitude: -3.537021,
          // latitude: 50.70038,
          // longitude: -3.4822,
          // latitude: 50.700367,
          // longitude: -3.482253,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
        // Geocode.fromLatLng(53.483002, -2.2931)
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (json) => {
            let addressComponent = json.results[0].address_components;
            addressComponent.filter((obj) => {
              if (obj?.types) {
                setPostcode("");
                if (obj.types[0] === "postal_code") {
                  // setPostcode(obj.long_name);

                  localStorage.setItem(
                    "searchData",
                    JSON.stringify({
                      keyword: "",
                      post_code: obj.long_name,
                      // latitude: 50.695874,
                      // longitude: -3.537021,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      distance: null,
                    })
                  );
                }
              }
            });
          },

          (error) => {
            console.error(error);
          }
        );

        dispatch(nearMeApi(obj));
      },

      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  };

  // haveItemToHireOutHandler
  const haveItemToHireOutHandler = () => {
    conditionCheck(navigate, email, has_primary_address, has_business_profile);
  };

  return (
    <div className="searchLandingWrapper">
      <div className="container body-height">
        <div className="row px-3 center pt-lg-5 pt-0">
          <div className="card card-searchl">
            <div className="card-body-searchl pb-2 px-0 mx-0">
              <Alert showError={showError} errorMessage={errorMessage} />

              <h4 className="search-title text-center mt-3">Search</h4>

              <form className="form-box px-3" onSubmit={searchHandler}>
                <div className="form-input">
                  <input
                    className="ml-2"
                    type="text"
                    placeholder="Enter a term, example ‘digger’"
                    name="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                  />
                </div>

                <div className="container container-pd">
                  <div className="row">
                    <div className="col-lg-6 col-6 p-0 pr-1">
                      <div className="form-input">
                        <input
                          className="mt-1 txt-search-landing"
                          type="text"
                          placeholder="Postcode"
                          name="postcode"
                          value={postcode}
                          onChange={(e) => {
                            setPostcode(e.target.value);
                            setSLTypedPostcode(true);
                          }}
                          required
                        />

                        <div
                          className="icon-position pointer"
                          onClick={myPostcodeHandler}
                        >
                          <MdMyLocation color="#ff6100" />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6 col-6 p-0 pl-1">
                      <div className="form-input">
                        <div className="select mt-1">
                          {/* <a
                            className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-search-landing mt-1"
                            type="button"
                            data-toggle="dropdown"
                            required
                          >
                            <span className="search-drop-txt">
                              {miles == null || miles == ""
                                ? "Unlimited"
                                : miles}
                            </span>
                            <span className="caret"></span>
                          </a>

                          <ul className="dropdown-menu">
                            {Distance.map((obj, index) => {
                              return (
                                <li
                                  key={index}
                                  onClick={(e) => setMiles(e.target.innerText)}
                                >
                                  <a href="#">{obj.label}</a>
                                </li>
                              );
                            })}
                          </ul> */}

                          <select
                            //className="btn dropdown-toggle dropdown-btn dropdown-btn-search-landing mt-1"
                            value={miles}
                            onChange={(e) => {
                              setMiles(e.target.value);
                            }}
                            required
                          >
                            {Distance.map((obj, index) => {
                              return (
                                <option key={index} value={obj.value}>
                                  {obj.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-hover btn-block text-uppercase"
                >
                  <span className="search-btn-txt">Search</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-block btn-hover text-uppercase mt-2 secondary-btn"
                  onClick={searchNearMeHandler}
                >
                  <span className="search-btn-txt">
                    <MdMyLocation className="search-btn-txt" />
                    &nbsp;Search near me
                  </span>
                </button>
              </form>

              <hr className="my-4 mx-auto" style={{ width: "250px" }} />

              <p className="pb-3">
                Have a piece of equipment to hire out or <br />
                sell instead?{" "}
                <a className="orange" onClick={haveItemToHireOutHandler}>
                  Post an advert!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchLanding };
