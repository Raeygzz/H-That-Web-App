import React, { useState, useEffect } from "react";

import Geocode from "react-geocode";
// import Calendar from "react-calendar";
import getDate from "date-fns/getDate";
import addDays from "date-fns/addDays";
import getMonth from "date-fns/getMonth";
import {
  format,
  // parseISO
} from "date-fns";
import { MdMyLocation } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaRegUser, FaSearchPlus } from "react-icons/fa";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
// import {
//   GoogleMap,
//   LoadScript,
//   useJsApiLoader,
//   DistanceMatrixService,
// } from "@react-google-maps/api";

import "./HireConfirm.css";
import { HTCalendar } from "../../shared/pages_common";
import {
  getObjectLength,
  // isSameDay
} from "../../utils";
import { CollectionType, MonthShortcut } from "../../constants";
import { SavedCardModal } from "../../shared/pages_common/modal";
import { findAddressFromPostcode } from "../../services/axios/Api";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { listUserCardsApi } from "../../toolkit/features/CardSlice";
import { hireItemPaymentApi } from "../../toolkit/features/PaymentSlice";
import {
  itemHireApi,
  findDistanceApi,
  dayToPriceApi,
} from "../../toolkit/features/HireSlice";

const HireConfirm = (props) => {
  const {} = props;

  const { has_primary_card } = useSelector((state) => state.auth.user);
  const { addressPickerList } = useSelector((state) => state.address);
  const { hireCalculatedDistance } = useSelector((state) => state.hire);
  const { calendarUnavailableDateList } = useSelector(
    (state) => state.calendar
  );
  const { numberOfDaysToPrice } = useSelector((state) => state.hire);
  const { showSavedCardModal } = useSelector((state) => state.card);
  const { itemHireId } = useSelector((state) => state.hire);
  const { showError } = useSelector((state) => state.error);
  const { errorMessage } = useSelector((state) => state.error);

  // calendar
  const [confirmDatesDisplay, setConfirmDatesDisplay] = useState([]);
  const [confirmDatesValidate, setConfirmDatesValidate] = useState(false);
  const [readyForMarkedDates, setReadyForMarkedDates] = useState([]);
  const [isStartDatePicked, setIsStartDatePicked] = useState(false);
  const [stateStartDate, setStateStartDate] = useState("");
  const [numberOfSelectedCalendarDates, setNumberOfSelectedCalendarDates] =
    useState([]);

  // radio button saved/manual address
  const [hireConfirmRadioButtonGroup, setHireConfirmRadioButtonGroup] =
    useState("");

  const [collectionType, setCollectionType] = useState("");

  // saved address
  const [savedAddress, setSavedAddress] = useState(true);
  const [pickedSavedAddress, setPickedSavedAddress] = useState("");
  const [savedAddressPostcode, setSavedAddressPostcode] = useState("");
  const [deliverySavedLatitude, setDeliverySavedLatitude] = useState("");
  const [deliverySavedLongitude, setDeliverySavedLongitude] = useState("");

  // manual address
  const [manualAddress, setManualAddress] = useState(false);
  const [typedPostcode, setTypedPostcode] = useState(false);
  const [pickedManualAddress, setPickedManualAddress] = useState("");
  const [manualAddressPostcode, setManualAddressPostcode] = useState("");
  const [deliveryManualLatitude, setDeliveryManualLatitude] = useState("");
  const [deliveryManualLongitude, setDeliveryManualLongitude] = useState("");
  const [manualAddressPickerOfPostcode, setManualAddressPickerOfPostcode] =
    useState([]);

  const [hireRate, setHireRate] = useState("");

  const [deliveryDistance, setDeliveryDistance] = useState("");

  const [datesTH, setDatesTH] = useState("");
  const [monthSD, setMonthSD] = useState("");
  const [monthED, setMonthED] = useState("");
  const [filteredDatesTH, setFilteredDatesTH] = useState("");

  const [hireDurationPrice, setHireDurationPrice] = useState("");

  const [summaryAddress, setSummaryAddress] = useState("");

  const [hireDeliveryPrice, setHireDeliveryPrice] = useState("");

  const [termsCondition, setTermsCondition] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { distance, singleHireItem } = state;

  // const isLoaded = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "AIzaSyCdyhBmyCcBI6deY-7Sfo3kjPzLwaj8exQ",
  // });
  // console.log("isLoaded ==> ", isLoaded);

  useEffect(() => {
    dispatch(listUserCardsApi());

    //   const request = {
    //     destinations: [{ lat: 1.296788, lng: 103.778961 }],
    //     origins: [{ lng: 72.89216, lat: 19.12092 }],
    //     // travelMode: google.maps.TravelMode.DRIVING,
    //     travelMode: "DRIVING",
    //     // unitSystem: google.maps.UnitSystem.METRIC,
    //     // avoidHighways: false,
    //     // avoidTolls: false,
    //   };

    //   service.getDistanceMatrix(request).then((response) => {
    //     console.log("response ==> ", response);
    //   });
  }, []);

  useEffect(() => {
    if (getObjectLength(singleHireItem) != 0) {
      setCollectionType(
        singleHireItem.is_for_collection === 1 &&
          singleHireItem.is_for_delivery === 1
          ? "1"
          : singleHireItem.is_for_collection === 1 &&
            singleHireItem.is_for_delivery === 0
          ? "1"
          : singleHireItem.is_for_collection === 0 &&
            singleHireItem.is_for_delivery === 1
          ? "0"
          : null
      );
    }
  }, [singleHireItem]);

  // calendar unavailable date list
  useEffect(() => {
    if (calendarUnavailableDateList.length > 0) {
      let readyForMarkedDates = [];
      for (let i = 0; i < calendarUnavailableDateList.length; i++) {
        readyForMarkedDates.push(calendarUnavailableDateList[i].date);
      }

      // console.log("readyForMarkedDates ==> ", readyForMarkedDates);
      setConfirmDatesDisplay(readyForMarkedDates);
    }
  }, [calendarUnavailableDateList]);

  // saved / maual address clean up
  useEffect(() => {
    if (savedAddress) {
      setPickedManualAddress("");
      setManualAddressPostcode("");
      setDeliveryManualLatitude("");
      setDeliveryManualLongitude("");
      setManualAddressPickerOfPostcode([]);
    }

    if (manualAddress) {
      setPickedSavedAddress("");
      setSavedAddressPostcode("");
      setDeliverySavedLatitude("");
      setDeliverySavedLongitude("");
    }
  }, [savedAddress, manualAddress]);

  // typed poscode execution
  useEffect(() => {
    if (typedPostcode) {
      setTypedPostcode(false);

      if (
        manualAddressPostcode.length >= 6 &&
        manualAddressPostcode.length < 9
      ) {
        setManualAddressPickerOfPostcode([]);

        findAddressFromPostcode(manualAddressPostcode)
          .then((res) => {
            if (res?.status === 200) {
              setDeliveryManualLatitude(res.data.latitude);
              setDeliveryManualLongitude(res.data.longitude);

              let addressArr = [];
              res.data.addresses.filter((obj, index) => {
                setPickedManualAddress("");
                setManualAddressPickerOfPostcode([]);
                addressArr.push({
                  id: index,
                  label: obj.split(",")[0],
                  value: obj.split(",")[0],
                });
              });

              addressArr.unshift({
                id: "-1",
                label: "--Select--",
                value: "",
              });

              let obj = {
                latitude1: singleHireItem.latitude,
                longitude1: singleHireItem.longitude,
                latitude2: res.data.latitude,
                longitude2: res.data.longitude,
              };

              dispatch(findDistanceApi(obj));

              setManualAddressPickerOfPostcode(addressArr);
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error.response);
          });
      }
    }
  }, [typedPostcode]);

  // savedAddressPostcodeHandler
  const savedAddressPostcodeHandler = (val) => {
    // console.log("val ==> ", val);

    if (addressPickerList.length > 0) {
      addressPickerList.filter((item) => {
        if (val != "" && val === item.value) {
          let remObj = {
            latitude1: singleHireItem.latitude,
            longitude1: singleHireItem.longitude,
            latitude2: item.lat,
            longitude2: item.lon,
          };

          dispatch(findDistanceApi(remObj));

          setSavedAddressPostcode(item.postcode);
          setDeliverySavedLatitude(item.lat);
          setDeliverySavedLongitude(item.lon);
          setSummaryAddress(item.value);
        }
      });
    }
  };

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
    setDeliveryManualLatitude(latitude);
    setDeliveryManualLongitude(longitude);

    let obj = {
      latitude1: singleHireItem.latitude,
      longitude1: singleHireItem.longitude,
      latitude2: position.coords.latitude,
      longitude2: position.coords.longitude,
    };

    dispatch(findDistanceApi(obj));

    // Geocode.fromLatLng(50.695874, -3.537021)
    Geocode.fromLatLng(latitude, longitude).then(
      (json) => {
        // console.log("json ==> ", json);

        let addressComponent = json.results[0].address_components;
        // console.log("addressComponent ==> ", addressComponent);

        addressComponent.filter((obj) => {
          if (obj?.types) {
            setManualAddressPostcode("");
            if (obj.types[0] === "postal_code") {
              let latLongFetchedAddresses = json.results;
              let latLong_postcode =
                latLongFetchedAddresses[0].formatted_address.split(",")[1];

              let addressArr1 = [];
              latLongFetchedAddresses.filter((obj, index) => {
                setManualAddressPickerOfPostcode([]);
                let obj_postcode = obj.formatted_address.split(",")[1];

                if (
                  obj_postcode !== undefined &&
                  latLong_postcode === obj_postcode
                ) {
                  addressArr1.push({
                    id: index,
                    label: obj.formatted_address.split(",")[0],
                    value: obj.formatted_address.split(",")[0],
                  });
                }
              });

              addressArr1.unshift({
                id: "-1",
                label: "--Select--",
                value: "",
              });

              setManualAddressPickerOfPostcode(addressArr1);

              setManualAddressPostcode(obj.long_name);
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
    //     Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);

    //     setDeliveryManualLatitude(position.coords.latitude);
    //     setDeliveryManualLongitude(position.coords.longitude);

    //     let obj = {
    //       latitude1: singleHireItem.latitude,
    //       longitude1: singleHireItem.longitude,
    //       latitude2: position.coords.latitude,
    //       longitude2: position.coords.longitude,
    //     };

    //     dispatch(findDistanceApi(obj));

    //     // Geocode.fromLatLng(53.483002, -2.2931)
    //     Geocode.fromLatLng(
    //       position.coords.latitude,
    //       position.coords.longitude
    //     ).then(
    //       (json) => {
    //         let addressComponent = json.results[0].address_components;
    //         addressComponent.filter((obj) => {
    //           if (obj?.types) {
    //             setManualAddressPostcode("");
    //             if (obj.types[0] === "postal_code") {
    //               let latLongFetchedAddresses = json.results;
    //               let latLong_postcode =
    //                 latLongFetchedAddresses[0].formatted_address.split(",")[1];

    //               let addressArr1 = [];
    //               latLongFetchedAddresses.filter((obj, index) => {
    //                 setManualAddressPickerOfPostcode([]);
    //                 let obj_postcode = obj.formatted_address.split(",")[1];

    //                 if (
    //                   obj_postcode !== undefined &&
    //                   latLong_postcode === obj_postcode
    //                 ) {
    //                   addressArr1.push({
    //                     id: index,
    //                     label: obj.formatted_address.split(",")[0],
    //                     value: obj.formatted_address.split(",")[0],
    //                   });
    //                 }
    //               });

    //               addressArr1.unshift({
    //                 id: "-1",
    //                 label: "--Select--",
    //                 value: "",
    //               });

    //               setManualAddressPickerOfPostcode(addressArr1);

    //               setManualAddressPostcode(obj.long_name);
    //             }
    //           }
    //         });
    //       },

    //       (error) => {
    //         console.error(error);
    //       }
    //     );
    //   },

    //   (error) => {
    //     console.error("Error Code = " + error.code + " - " + error.message);
    //   }
    // );
  };

  // myPostcodeHandler
  const myPostcodeHandler = (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            // console.log("granted ==> ", result.state);
            findUserPostcodeHandler();
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
              functionHandler: "findUserPostcodeHandler",
              shouldCallback: () => findUserPostcodeHandler(),
            };

            dispatch(presentModal(modalConfig));
            //
          } else if (result.state === "denied") {
            // console.log("denied ==> ", result.state);
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            // console.log("onchange ==> ", result.state);
          };
        });
    } else {
      console.log("Sorry! User Location Access Is Not available.");
    }
  };

  // useEffect(() => {
  //   if (savedAddress && addressPickerList.length > 0) {
  //     if (pickedSavedAddress != "") {
  //       // let tempPickedSavedAddress =
  //       //   pickedSavedAddress != ""
  //       //     ? pickedSavedAddress
  //       //     : addressPickerList.length > 0
  //       //     ? addressPickerList[0].value
  //       //     : "";

  //       addressPickerList.filter((obj) => {
  //         if (obj.value == pickedSavedAddress) {
  //           setDeliverySavedLatitude(obj.lat);
  //           setDeliverySavedLongitude(obj.lon);
  //           setDeliveryPostcodeFromSavedAddressPicker(obj.postcode);

  //           let remObj = {
  //             latitude1: singleHireItem.latitude,
  //             longitude1: singleHireItem.longitude,
  //             latitude2: obj.lat,
  //             longitude2: obj.lon,
  //           };

  //           dispatch(findDistanceApi(remObj));
  //         }
  //       });
  //     }
  //   }

  //   if (
  //     manualAddress &&
  //     deliveryManualLatitude != "" &&
  //     deliveryManualLongitude != ""
  //   ) {
  //     let obj = {
  //       latitude1: singleHireItem.latitude,
  //       longitude1: singleHireItem.longitude,
  //       latitude2: deliveryManualLatitude,
  //       longitude2: deliveryManualLongitude,
  //     };

  //     dispatch(findDistanceApi(obj));
  //   }
  // }, [
  //   savedAddress,
  //   addressPickerList,
  //   pickedSavedAddress,
  //   manualAddress,
  //   deliveryManualLatitude,
  //   deliveryManualLongitude,
  // ]);

  // clearCalendarDatesHandler
  const clearCalendarDatesHandler = () => {
    setReadyForMarkedDates([]);
    setIsStartDatePicked(false);
    setNumberOfSelectedCalendarDates([]);
    setStateStartDate("");
    setDatesTH("");
    setMonthSD("");
    setFilteredDatesTH("");
    setMonthED("");
    setHireDurationPrice("");
    setHireDeliveryPrice("");
  };

  const readyForMarkedDatesHandler = (day) => {
    // console.log("day ==> ", day);
    setReadyForMarkedDates((prevArray) => [...prevArray, day]);
  };

  useEffect(() => {
    if (readyForMarkedDates.length > 0) {
      // console.log("readyForMarkedDates[0] ==> ", readyForMarkedDates[0]);

      if (isStartDatePicked == false) {
        setNumberOfSelectedCalendarDates((prevArray) => [
          ...prevArray,
          readyForMarkedDates[0],
        ]);

        setIsStartDatePicked(true);
        setStateStartDate(readyForMarkedDates[0]);
        //
      } else {
        let startDate = stateStartDate;
        // console.log("sd ==> ", startDate);
        let endDate = readyForMarkedDates[1];
        // console.log("ed ==> ", endDate);
        let range = differenceInCalendarDays(endDate, startDate) + 1;
        // console.log("range ==> ", range);

        if (range > 0) {
          for (let i = 1; i <= range - 1; i++) {
            let tempDate = addDays(startDate, i);
            // console.log("tempDate ==> ", tempDate);

            for (let j = 0; j < calendarUnavailableDateList.length; j++) {
              let formatedTempDate = format(new Date(tempDate), "MM/dd/yyyy");
              let formatedCalendarUnavailableDates = format(
                new Date(calendarUnavailableDateList[j].date),
                "MM/dd/yyyy"
              );

              // console.log("formatedTempDate ==> ", formatedTempDate);
              // console.log("formatedCalendarUnavailableDates ==> ", formatedCalendarUnavailableDates);

              if (formatedTempDate === formatedCalendarUnavailableDates) {
                let modalConfig = {
                  title: "Oops!",
                  showCancelButton: false,
                  shouldRunFunction: true,
                  functionHandler: "clearCalendarDatesHandler",
                  message:
                    "One or more date among your selected dates have already been taken. Invalid operation.",
                  shouldCallback: () => clearCalendarDatesHandler(),
                };

                dispatch(presentModal(modalConfig));
                return;
              }
            }

            setNumberOfSelectedCalendarDates((prevArray) => [
              ...prevArray,
              tempDate,
            ]);

            setIsStartDatePicked(false);
            setStateStartDate("");
          }
        }

        if (range < 1) {
          let modalConfig = {
            title: "Oops!",
            showCancelButton: false,
            shouldRunFunction: true,
            functionHandler: "clearCalendarDatesHandler",
            message: "Please select an upcoming date.",
            shouldCallback: () => clearCalendarDatesHandler(),
          };

          dispatch(presentModal(modalConfig));
        }
      }
    }
  }, [readyForMarkedDates]);

  useEffect(() => {
    if (numberOfSelectedCalendarDates.length > 0) {
      // console.log("numberOfSelectedCalendarDates ==> ", numberOfSelectedCalendarDates);

      setConfirmDatesValidate(false);

      let obj = {
        navigate: navigate,
        item_id: singleHireItem.id,
        number_of_days: numberOfSelectedCalendarDates.length,
      };

      dispatch(dayToPriceApi(obj));

      setDatesTH("");
      let hireDurationStartDate = numberOfSelectedCalendarDates[0];
      // console.log("hireDurationStartDate ==> ", hireDurationStartDate);

      let startDateMonthNum = getMonth(hireDurationStartDate);
      // console.log("startDateMonthNum ==> ", startDateMonthNum);

      let monthSD = MonthShortcut[startDateMonthNum];
      // console.log("monthSD ==> ", monthSD);

      let SDate = getDate(hireDurationStartDate);
      // console.log("SDate ==> ", SDate);

      setDatesTH(SDate);
      setMonthSD(monthSD);

      if (numberOfSelectedCalendarDates.length > 1) {
        let hireDurationEndDate = numberOfSelectedCalendarDates.slice(-1)[0];
        // console.log("hireDurationEndDate ==> ", hireDurationEndDate);

        if (hireDurationEndDate != "") {
          let endDateMonthNum = getMonth(hireDurationEndDate);
          // console.log("endDateMonthNum ==> ", endDateMonthNum);

          let monthED = MonthShortcut[endDateMonthNum];
          // console.log("monthED ==> ", monthED);

          let EDate = getDate(hireDurationEndDate);
          // console.log("EDate ==> ", EDate);

          setFilteredDatesTH(EDate);
          setMonthED(monthED);
        }
      }
    }
  }, [numberOfSelectedCalendarDates]);

  useEffect(() => {
    if (numberOfDaysToPrice > 0) {
      // console.log("numberOfDaysToPrice ==> ", numberOfDaysToPrice);

      setHireDurationPrice(numberOfDaysToPrice.toFixed(2));
    }
  }, [numberOfDaysToPrice]);

  useEffect(() => {
    if (hireCalculatedDistance != "") {
      setDeliveryDistance(parseFloat(hireCalculatedDistance));

      setHireRate(
        (
          singleHireItem.delivery_charge_mile *
          parseFloat(hireCalculatedDistance)
        ).toFixed(2)
      );

      setHireDeliveryPrice(
        (
          singleHireItem.delivery_charge_mile *
          parseFloat(hireCalculatedDistance)
        ).toFixed(2)
      );
    }
  }, [hireCalculatedDistance]);

  const confirmAndPayHandler = (e) => {
    e.preventDefault();

    if (showError) {
      let modalConfig = {
        title: "Oops!",
        showCancelButton: false,
        shouldRunFunction: true,
        functionHandler: "clearCalendarDatesHandler",
        message: errorMessage,
        shouldCallback: () => clearCalendarDatesHandler(),
      };

      dispatch(presentModal(modalConfig));
      return;
    }

    // if (has_primary_card !== 1) {
    //   navigate("/add-card");
    //   return;
    // }

    if (numberOfSelectedCalendarDates.length < 1) {
      setConfirmDatesValidate(true);
      return;
    }

    let hireItemAddressDeliveryDistance =
      singleHireItem.delivery_distance != null
        ? singleHireItem.delivery_distance
        : deliveryDistance * 2;

    if (
      collectionType === "0" &&
      deliveryDistance > hireItemAddressDeliveryDistance
    ) {
      let modalConfig = {
        title: "Oops!",
        message: `Please select another address with delivery distance lesser then ${hireItemAddressDeliveryDistance} miles as specified by supplier or set the collection type to collecting.`,
      };

      dispatch(presentModal(modalConfig));
      return;
    }

    let finalDates = [];
    if (numberOfSelectedCalendarDates.length > 0) {
      finalDates = numberOfSelectedCalendarDates.map((item) => {
        return format(new Date(item), "yyyy-MM-dd");
      });

      // console.log("finalDates ==> ", finalDates);
    }

    let obj = {
      item_id: singleHireItem.id,
      dates: finalDates,
      collection_type:
        singleHireItem.is_for_collection === 1 &&
        singleHireItem.is_for_delivery === 1
          ? collectionType === "0"
            ? "delivery"
            : "collecting"
          : singleHireItem.is_for_collection === 1
          ? "collecting"
          : singleHireItem.is_for_delivery === 1
          ? "delivery"
          : null,
      payment_status: "pending",
      delivery_distance: deliveryDistance,
      delivery_address:
        collectionType === "1"
          ? singleHireItem.location
          : savedAddress
          ? pickedSavedAddress
          : pickedManualAddress,
      delivery_post_code:
        collectionType === "1"
          ? singleHireItem.post_code
          : savedAddress
          ? savedAddressPostcode
          : manualAddress
          ? manualAddressPostcode
          : null,
      delivery_latitude:
        collectionType === "1"
          ? singleHireItem.latitude
          : savedAddress
          ? deliverySavedLatitude
          : manualAddress
          ? deliveryManualLatitude
          : null,
      delivery_longitude:
        collectionType === "1"
          ? singleHireItem.longitude
          : savedAddress
          ? deliverySavedLongitude
          : manualAddress
          ? deliveryManualLongitude
          : null,
      accepted_terms_and_conditions: termsCondition ? "1" : "0",
    };

    // console.log("obj ==> ", obj);
    dispatch(itemHireApi(obj));
  };

  // payItemHireHandler
  const payItemHireHandler = (selectedCard) => {
    let numberOfDays =
      numberOfSelectedCalendarDates.length > 9
        ? numberOfSelectedCalendarDates.length
        : "0" + numberOfSelectedCalendarDates.length;

    let durationOfDays = `(${datesTH}${
      monthSD != monthED ? " " + monthSD : ""
    } - ${filteredDatesTH} ${monthED})`;

    let obj = {
      navigate: navigate,
      name: singleHireItem.name,
      daysDuration: `${numberOfDays} days ${durationOfDays}`,
      item_hire_id: itemHireId,
      payment_method_id: selectedCard.id,
    };

    // console.log("obj ==> ", obj);
    dispatch(hireItemPaymentApi(obj));
  };

  let fullUserName =
    singleHireItem?.owner?.first_name + " " + singleHireItem?.owner?.last_name;
  return (
    <>
      <form onSubmit={confirmAndPayHandler}>
        <div className="container">
          <a className="back py-3 mt-5" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to results
          </a>

          {/* <GoogleMap>
            <LoadScript googleMapsApiKey="AIzaSyCdyhBmyCcBI6deY-7Sfo3kjPzLwaj8exQ">
              <DistanceMatrixService
                options={{
                  destinations: [{ lat: 1.296788, lng: 103.778961 }],
                  origins: [{ lng: 72.89216, lat: 19.12092 }],
                  travelMode: "DRIVING",
                }}
                callback={(res) => {
                  console.log("RESPONSE ==> ", res);
                  console.log(
                    "totalTime ==> ",
                    res.rows[0].elements[0].duration.text
                  );
                  console.log(
                    "totalDistance ==> ",
                    res.rows[0].elements[0].distance.text
                  );
                }}
              />
            </LoadScript>
          </GoogleMap> */}

          <div className="row pb-5">
            <div className="col-md-5 col-12 pt-3 pb-md-0 pb-4">
              <img
                src={singleHireItem.main_image}
                alt="tractor"
                className="img-prod-hire"
              />

              <div className="rounded-circle circle-btn">
                <FaSearchPlus />
              </div>
            </div>

            <div className="col-md-7 col-12 pt-3">
              <h2>
                <b>{singleHireItem.name}</b>
              </h2>

              <p>Hire from</p>

              {/* prices */}
              <div className="container">
                <div className="row">
                  {singleHireItem.price_day_1 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_1}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">1 Day</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_2 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_2}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">2 Days</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_3 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_3}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">3 Days</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_4 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_4}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">4 Days</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_5 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_5}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">5 Days</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_6 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_6}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">6 Days</b>
                      </p>
                    </div>
                  )}

                  {singleHireItem.price_day_7 != null && (
                    <div className="col-lg-2 col-3 p-0">
                      <h4>
                        <b>{`£${singleHireItem.price_day_7}`}</b>
                      </h4>

                      <p>
                        <b className="light-prod-hire">7 Days</b>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-4" />

              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="rounded-circle circle-btn circle-grey d-inline-block">
                      <FaRegUser />
                    </div>

                    <div className="d-inline-block pl-3 ml-2">
                      <span className="light-prod-hire">provided by </span>

                      <b>{fullUserName}</b>

                      <p className="pt-2">
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star-half-full" />
                        <span>4.5 star rating</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6 col-12">
                    <i className="fa fa-map-pin orange-pin pl-3 ml-1" aria-hidden="true" />

                    <div className="pl-5 ml-3">
                      <h3 className="m-0">
                        <b>{distance}</b>
                      </h3>
                      <span className="m-0">{`miles away from ${singleHireItem.post_code}`}</span>
                    </div>
                  </div>
                </div>

                <hr className="mt-2" />

                <div className="row">
                  <div className="col-7 col-md-7 col-lg-9">
                    <p>
                      <b>Hire Dates</b>
                    </p>
                  </div>

                  <div
                    className="col-5 col-md-5 col-lg-3 text-right"
                    onClick={clearCalendarDatesHandler}
                  >
                    <a className="orange">
                      <i className="fa fa-repeat" aria-hidden="true" /> Clear
                      Dates
                    </a>
                  </div>
                </div>

                {/* calendar */}
                <div className="card card-calendar mb-3">
                  <div className="card-body">
                    <HTCalendar
                      confirmDatesDisplay={confirmDatesDisplay}
                      // confirmDatesDisplayFromHireConfirm={confirmDatesDisplay}
                      numberOfSelectedCalendarDates={
                        numberOfSelectedCalendarDates
                      }
                      onChange={(day) => {
                        if (readyForMarkedDates.length < 2) {
                          readyForMarkedDatesHandler(day);
                        }
                      }}
                    />

                    {/* <Calendar
                      minDetail="month"
                      defaultView="month"
                      next2Label={null}
                      next2AriaLabel=""
                      prev2Label={null}
                      prev2AriaLabel=""
                      minDate={new Date()}
                      tileDisabled={({ date, view }) => {
                        // disable unavailable dates
                        if (view === "month") {
                          return (
                            confirmDatesDisplay?.length > 0 &&
                            confirmDatesDisplay.find((dDate) => {
                              return isSameDay(parseISO(dDate), date);
                            })
                          );
                        }
                      }}
                      tileClassName={({ activeStartDate, date, view }) => {
                        // display date range
                        if (
                          view === "month" &&
                          numberOfSelectedCalendarDates?.length > 0 &&
                          numberOfSelectedCalendarDates.find((BookedDate) => {
                            // let repeatedDate = format(new Date(date), "MM/dd/yyyy");
                            // let findDate = format(new Date(BookedDate), "MM/dd/yyyy");
                            //
                            // console.log("findDate ==> ", findDate);
                            // console.log("repeatedDate ==> ", repeatedDate);
                            //
                            // console.log("date ==> ", date);
                            // console.log("BookedDate ==> ", BookedDate);
                            // console.log("isSameDay ==> ", isSameDay(BookedDate, date));
                            //
                            // return findDate === repeatedDate;
                            return isSameDay(BookedDate, date);
                          })
                        ) {
                          return "marked_as_date_range";
                        }
                      }}
                      tileContent={({ activeStartDate, date, view }) => {
                        // display customer booked dates
                        if (
                          view === "month" &&
                          confirmDatesDisplay.length > 0 &&
                          confirmDatesDisplay.find((BookedDate) =>
                            isSameDay(parseISO(BookedDate), date)
                          )
                        ) {
                          return <i className="highlight-dot"></i>;
                        }
                      }}
                      onChange={(day) => {
                        if (readyForMarkedDates.length < 2) {
                          readyForMarkedDatesHandler(day);
                        }
                      }}
                    /> */}
                  </div>
                </div>

                {confirmDatesValidate && (
                  <p style={{ color: "red" }}>
                    Please select at least one date
                  </p>
                )}

                <div className="row">
                  <div className="col-6 text-center">
                    <span className="range-left" />
                    &nbsp;&nbsp;
                    <span className="">Start Date</span>
                  </div>

                  <div className="col-6 text-center">
                    <span className="range-right" />
                    &nbsp;&nbsp;
                    <span> End Date</span>
                  </div>
                </div>

                <p className="pt-4 mb-0 light-prod-hire">
                  Delivery / Collection
                </p>

                <hr className="mt-0 mb-4" />

                {collectionType === "0" && (
                  <>
                    <div className="row">
                      <div className="col-7 col-lg-9">
                        <i
                          className="fa fa-check orange-no-pointer"
                          aria-hidden="true"
                        />
                        &nbsp; Delivery
                      </div>

                      <div className="col-5 col-lg-3 light-prod-hire text-right">
                        Charges Apply
                      </div>
                    </div>

                    <div className="row pt-4">
                      <div className="col-12 col-md-6">
                        <input
                          type="radio"
                          defaultChecked
                          name="hireConfirmRadio"
                          id="savedAdd"
                          value={hireConfirmRadioButtonGroup}
                          onChange={(e) => {
                            setSavedAddress(true);
                            setManualAddress(false);
                            setHireConfirmRadioButtonGroup("savedAddress");
                          }}
                        />
                        <label htmlFor="savedAdd"> Saved Address</label>
                      </div>

                      <div className="col-12 col-md-6">
                        <input
                          type="radio"
                          name="hireConfirmRadio"
                          id="manualAdd"
                          value={hireConfirmRadioButtonGroup}
                          onChange={(e) => {
                            setSavedAddress(false);
                            setManualAddress(true);
                            setHireConfirmRadioButtonGroup("manualAddress");
                          }}
                        />
                        <label htmlFor="manualAdd"> Manual Address</label>
                      </div>
                    </div>

                    {/* For Saved Address */}
                    {savedAddress && (
                      <div className="row">
                        <div className="col-12">
                          <div className="select mt-3">
                            <select
                              //className="btn btn-primary dropdown-toggle dropdown-btn mt-3"
                              value={pickedSavedAddress}
                              onChange={(e) => {
                                setPickedSavedAddress(e.target.value);
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
                        </div>
                      </div>
                    )}

                    {/* For Manual Address */}
                    {manualAddress && (
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <input
                            className="txtbox mr-3 mt-3"
                            placeholder="Post code"
                            name="manualAddressPostcode"
                            value={manualAddressPostcode}
                            onChange={(e) => {
                              setTypedPostcode(true);
                              setManualAddressPostcode(e.target.value);
                            }}
                            required
                          />

                          <div onClick={myPostcodeHandler}>
                            <MdMyLocation
                              className="icon-postcode orange-no-pointer"
                              color="#ff6100"
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="select mt-3">
                            <select
                              // disabled={'' ? false : true}
                              //className={`btn btn-primary dropdown-toggle dropdown-btn mt-3`}
                              value={pickedManualAddress}
                              onChange={(e) => {
                                setPickedManualAddress(e.target.value);
                                setSummaryAddress(e.target.value);
                              }}
                              required
                            >
                              {manualAddressPickerOfPostcode.map(
                                (obj, index) => {
                                  return (
                                    <option key={index} value={obj.value}>
                                      {obj.label}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Collection Type */}
                <div className="row pt-3">
                  <div className="col-md-3 col-12 pt-2">
                    <span>Collection Type:</span>
                  </div>
                  <div className="pl-md-0 col-md-9 col-12">
                    <div
                      className={`select mt-0 ${
                        singleHireItem.is_for_collection === 1 &&
                        singleHireItem.is_for_delivery === 1
                          ? ""
                          : "disabled"
                      }`}>
                      <select
                        disabled={
                          singleHireItem.is_for_collection === 1 &&
                          singleHireItem.is_for_delivery === 1
                            ? false
                            : true
                        } 
                        //className={`btn btn-primary dropdown-toggle dropdown-btn mt-0`}
                        value={collectionType}
                        onChange={(e) => {
                          setCollectionType(e.target.value);
                        }}
                        required
                      >
                        {CollectionType.map((obj, index) => {
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

                {/* Delivery to */}
                <div className="row pt-2">
                  <div className="col-6">
                    {collectionType === "0" && (
                      <>
                        <span className="light-prod-hire">Delivery to</span>
                        <p>
                          {savedAddress && pickedSavedAddress}

                          {manualAddress && pickedManualAddress}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="col-6">
                    <span className="light-prod-hire">Charge</span>
                    <br />
                    <span className="flamabold pound-confirm">
                      {/* <i className="fa fa-gbp" aria-hidden="true" /> */}

                      {collectionType === "0" &&
                      numberOfSelectedCalendarDates.length > 0
                        ? `£${hireRate}`
                        : "£0"}
                    </span>
                    &nbsp;&nbsp;
                    <span className="light-prod-hire pound-confirm-second">
                      <i className="fa fa-gbp" aria-hidden="true" />
                      {singleHireItem.delivery_charge_mile} per mile
                    </span>
                  </div>
                </div>

                <hr className="mb-3 mt-3" />

                <div className="row">
                  <div className="col-9 col-md-6">
                    <p>Collection in person</p>
                  </div>

                  <div className="col-3 col-md-6">
                    <p className="light-prod-hire float-right">FREE</p>
                  </div>
                </div>

                <hr className="mb-2 mt-1" />

                <p>
                  <b>HIRE SUMMARY</b>
                </p>

                {/* hire summary */}
                <div className="row pb-4">
                  <div className="col-12 col-md-6">
                    <p className="light-prod-hire">Hire Duration</p>

                    <span>
                      {numberOfSelectedCalendarDates.length > 9
                        ? numberOfSelectedCalendarDates.length
                        : "0" + numberOfSelectedCalendarDates.length}{" "}
                      days{" "}
                      {datesTH != "" || filteredDatesTH != ""
                        ? `(${datesTH}${
                            monthSD != monthED ? " " + monthSD : ""
                          } - ${filteredDatesTH} ${monthED})`
                        : null}
                    </span>

                    <span className="flamabold float-right">
                      {/* <i className="fa fa-gbp" aria-hidden="true" /> */}
                      {hireDurationPrice != ""
                        ? `£${hireDurationPrice}`
                        : "£0"}{" "}
                      {singleHireItem.vat_applicable === 1 && "+ Vat"}
                    </span>

                    <hr className="mb-2 mt-1" />

                    <hr className="mb-4 mt-3 mobileshow" />
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="light-prod-hire">
                      {collectionType == "0"
                        ? "Hire Delivery"
                        : "Collecting Address"}
                    </p>

                    <span>
                      {collectionType === "1" &&
                        `${singleHireItem.location}, ${singleHireItem.post_code}`}

                      {collectionType === "0" &&
                        `${summaryAddress}, ${
                          savedAddress
                            ? savedAddressPostcode
                            : manualAddressPostcode
                        }`}
                    </span>

                    <span className="flamabold float-right">
                      {collectionType === "0" &&
                      numberOfSelectedCalendarDates.length > 0
                        ? `£${hireDeliveryPrice}`
                        : "£0"}
                    </span>

                    <hr className="mb-2 mt-1" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 pl-4 ml-1">
                  <input
                    type="checkbox"
                    id="termsCondition"
                    htmlFor="termsCondition"
                    name="termsCondition"
                    checked={termsCondition}
                    onChange={(e) => setTermsCondition(e.target.checked)}
                    required
                  />

                  <label htmlFor="termsCondition">
                    I have read &amp; agree to the{" "}
                    <a
                      className="orange"
                      href="https://hirethat.com/hire-terms-conditions/"
                      hrefLang="en"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      target={"_blank"}
                    >
                      {" "}
                      terms and conditions{" "}
                    </a>
                  </label>

                  <p className="light-prod-hire pl-4 ml-1">
                    By continuing you agree that you have read &amp; agree to
                    the hiring terms &amp; conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="banner py-3 w3-animate-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-8 col-12">
                {/* total hire cost */}
                <span className="flamabold">
                  TOTAL HIRE COST &nbsp;
                  {hireDurationPrice != "" || hireDeliveryPrice != ""
                    ? collectionType === "0"
                      ? `£${(
                          parseFloat(hireDurationPrice) +
                          parseFloat(hireDeliveryPrice)
                        ).toFixed(2)}`
                      : `£${hireDurationPrice}`
                    : `£0`}
                </span>

                <p className="vat-text">
                  (
                  {/* {singleHireItem.vat_applicable === 1 ? "Ex VAT 20% and " : null} */}
                  {singleHireItem.vat_applicable === 1
                    ? "Ex VAT 20% and Admin fee"
                    : "Ex Admin fee"}
                  )
                </p>
              </div>

              <div className="col-lg-3 col-md-4 col-12 my-auto">
                <button
                  type="submit"
                  className="btn btn-banner-prod btn-hire-confirm  flamabold"
                >
                  CONFIRM &amp; PAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showSavedCardModal && (
        <SavedCardModal
          selectedCardForItem={(card) => payItemHireHandler(card)}
        />
      )}
    </>
  );
};

export { HireConfirm };
