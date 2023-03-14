import React, { useState, useEffect } from "react";

import Geocode from "react-geocode";
// import Calendar from "react-calendar";
import { toast } from "react-toastify";
import {
  format,
  // parseISO
} from "date-fns";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiOutlineReload } from "react-icons/ai";
import { FaArrowLeft, FaPoundSign } from "react-icons/fa";

import "./EditAdvert.css";
import { HTCalendar } from "../../shared/pages_common";
import { YesNo, Distance } from "../../constants/Constant";
import { PhotoModal } from "../../shared/pages_common/modal";
import { RegExp, getYears, getObjectLength } from "../../utils";
import { findAddressFromPostcode } from "../../services/axios/Api";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";
import {
  LengthSchema,
  WidthSchema,
  DepthSchema,
  ForSaleSchema,
} from "../../shared/validations/PostAdvert";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { subCategoriesApi } from "../../toolkit/features/CategoriesSlice";
import {
  showPhotoModal,
  editAdvertApi,
  manualAddressPostcodePicker,
} from "../../toolkit/features/AdvertsSlice";
import {
  calendarDateDeleteByIdApi,
  calendarDatesMakingUnavailableApi,
} from "../../toolkit/features/CalendarSlice";
import {
  addMainImage,
  addPhotos,
  setCount,
  deleteAll,
} from "../../toolkit/features/AdvertPhotosSlice";

const EditAdvert = (props) => {
  const {} = props;

  const { addressPickerList } = useSelector((state) => state.address);
  const { categoriesPickerList } = useSelector((state) => state.categories);
  const { subCategoriesPickerList } = useSelector((state) => state.categories);
  const { categoriesHirePickerList } = useSelector((state) => state.categories);
  const { categoriesSalePickerList } = useSelector((state) => state.categories);
  const { categoriesForBothPickerList } = useSelector(
    (state) => state.categories
  );
  const { photos } = useSelector((state) => state.advertPhotos);
  const { mainImage } = useSelector((state) => state.advertPhotos);
  const { isPhotoModalVisible } = useSelector((state) => state.adverts);
  const { singleAdvert } = useSelector((state) => state.adverts);
  const { manualAddressPickerOfPostcode } = useSelector(
    (state) => state.adverts
  );
  const { calendarUnavailableDateList } = useSelector(
    (state) => state.calendar
  );

  // title
  const [advertTitle, setAdvertTitle] = useState("");
  // const [advertTitleValidate, setAdvertTitleValidate] = useState(false);

  // advertise for hire / sale
  const [advertiseToHire, setAdvertiseToHire] = useState(false);
  const [advertiseToSale, setAdvertiseToSale] = useState(false);
  const [toggleButtonValidate, setToggleButtonValidate] = useState(false);

  // image
  // const [modalMainImage, setModalMainImage] = useState([]);
  // const [advertMainImage, setAdvertMainImage] = useState([]);
  // const [modalPhotos, setModalPhotos] = useState([]);
  // const [advertPhotos, setAdvertPhotos] = useState([]);
  // const [postAdvertPhotosErrorMessage, setPostAdvertPhotosErrorMessage] =
  //   useState("");
  // const [postAdvertMainImageErrorMessage, setPostAdvertMainImageErrorMessage] =
  //   useState("");

  // category
  const [advertCategory, setAdvertCategory] = useState("");
  // const [advertCategoryErrorMessage, setAdvertCategoryErrorMessage] =
  //   useState("");
  const [advertCategorySelectedId, setAdvertCategorySelectedId] = useState("");
  // const [advertCategoryValidate, setAdvertCategoryValidate] = useState(false);
  // const [clearCategoryPickerDefaultValue, setClearCategoryPickerDefaultValue] =
  //   useState(false);

  // sub category
  const [advertSubCategory, setAdvertSubCategory] = useState("");
  // const [advertSubCategoryErrorMessage, setAdvertSubCategoryErrorMessage] =
  //   useState("");
  // const [advertSubCategoryValidate, setAdvertSubCategoryValidate] =
  //   useState(false);
  // const [
  //   clearSubCategoryPickerDefaultValue,
  //   setClearSubCategoryPickerDefaultValue,
  // ] = useState(false);

  // make
  const [make, setMake] = useState("");
  // const [makeValidate, setMakeValidate] = useState(false);

  // model
  const [model, setModel] = useState("");
  // const [modelValidate, setModelValidate] = useState(false);

  // description
  const [description, setDescription] = useState("");
  // const [descriptionValidate, setDescriptionValidate] = useState(false);

  // age / constant years
  const [age, setAge] = useState("");
  const constantYears = useState(getYears())[0];
  // const [ageValidate, setAgeValidate] = useState(false);

  // mileage
  const [mileage, setMileage] = useState("");
  // const [mileageValidate, setMileageValidate] = useState(false);

  // hours used
  const [hoursUsed, setHoursUsed] = useState("");
  // const [hoursUsedValidate, setHoursUsedValidate] = useState(false);

  // length
  const [length, setLength] = useState("");
  // const [lengthValidate, setLengthValidate] = useState(false);
  // const [lengthErrorMessage, setLengthErrorMessage] = useState('');

  // width
  const [width, setWidth] = useState("");
  // const [widthValidate, setWidthValidate] = useState(false);
  // const [widthErrorMessage, setWidthErrorMessage] = useState('');

  // depth
  const [depth, setDepth] = useState("");
  // const [depthValidate, setDepthValidate] = useState(false);
  // const [depthErrorMessage, setDepthErrorMessage] = useState('');

  // radio button saved/manual address
  const [editAdvertRadioButtonGroup, setEditAdvertRadioButtonGroup] =
    useState("");
  // const [postAdvertSavedAddress, setPostAdvertSavedAddress] = useState(true);
  // const [postAdvertManualAddress, setPostAdvertManualAddress] = useState(false);

  // saved address
  const [pickedSavedAddress, setPickedSavedAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState(true);
  const [savedAddressPostcode, setSavedAddressPostcode] = useState("");

  const [itemLocation, setItemLocation] = useState("");
  // const [addressFromPostcode, setAddressFromPostcode] = useState("");
  // const [addressFromPostcodeValidate, setAddressFromPostcodeValidate] =
  //   useState(false);
  // const [itemLocationValidate, setItemLocationValidate] = useState(false);
  // const [itemLocationErrorMessage, setItemLocationErrorMessage] = useState("");

  // manual address
  const [manualAddress, setManualAddress] = useState(false);
  const [pickedManualAddress, setPickedManualAddress] = useState("");
  const [typedPostcode, setTypedPostcode] = useState(false);
  const [fromGeoLocation, setFromGeoLocation] = useState(false);
  const [manualAddressPostcode, setManualAddressPostcode] = useState("");
  // const [
  //   manualAddressItemLocationValidate,
  //   setManualAddressItemLocationValidate,
  // ] = useState(false);
  // const [latLongFetchedAddresses, setLatLongFetchedAddresses] = useState([]);
  // const [manualAddressPickerOfPostcode, setManualAddressPickerOfPostcode] =
  //   useState([]);

  // latitude / longitude
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // collection available
  const [collectionAvailable, setCollectionAvailable] = useState("");
  // const [collectionAvailableErrorMessage, setCollectionAvailableErrorMessage] =
  //   useState("");
  // const [
  // 	collectionAvailableValidate,
  // 	setCollectionAvailableValidate,
  // ] = useState(false);

  // delivery available
  const [deliveryAvailable, setDeliveryAvailable] = useState("");
  // const [deliveryAvailableErrorMessage, setDeliveryAvailableErrorMessage] =
  //   useState("");
  // const [deliveryAvailableValidate, setDeliveryAvailableValidate] =
  //   useState(false);

  // delivery distance
  const [deliveryDistance, setDeliveryDistance] = useState("");
  // const [deliveryDistanceErrorMessage, setDeliveryDistanceErrorMessage] =
  //   useState("");
  // const [deliveryDistanceValidate, setDeliveryDistanceValidate] =
  //   useState(false);

  // delivery charge
  const [deliveryCharge, setDeliveryCharge] = useState("");
  // const [deliveryChargeValidate, setDeliveryChargeValidate] = useState(false);
  // const [deliveryChargeErrorMessage, setDeliveryChargeErrorMessage] =
  //   useState("");

  // hire price
  // const [hirePrice, setHirePrice] = useState("");
  const [values, setValues] = useState([
    {
      id: 0,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 1,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 2,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 3,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 4,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 5,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
    {
      id: 6,
      perDayPrice: "",
      perDayWiseValidate: false,
      // perDayPriceRef: useRef(),
    },
  ]);
  const [perDayPriceValidate, setPerDayPriceValidate] = useState("");
  const [perDayWiseValidateText, setPerDayWiseValidateText] = useState("");
  const [hirePriceDayWiseValidate, setHirePriceDayWiseValidate] =
    useState(false);

  // for sale
  const [forSale, setForSale] = useState("");
  const [forSaleValidate, setForSaleValidate] = useState(false);
  // const [forSaleErrorMessage, setForSaleErrorMessage] = useState("");

  // plus vat
  const [plusVAT, setPlusVAT] = useState(false);

  // offers accepted
  const [offersAccepted, setOffersAccepted] = useState("");
  // const [offersAcceptedErrorMessage, setOffersAcceptedErrorMessage] =
  //   useState("");
  // const [offersAcceptedValidate, setOffersAcceptedValidate] = useState(false);

  // weight
  const [weight, setWeight] = useState("");
  // const [weightValidate, setWeightValidate] = useState(false);
  // const [weightErrorMessage, setWeightErrorMessage] = useState('');

  // product code
  const [productCode, setProductCode] = useState("");
  // const [productCodeValidate, setProductCodeValidate] = useState(false);
  // const [productCodeErrorMessage, setProductCodeErrorMessage] = useState("");

  // ean
  const [ean, setEAN] = useState("");
  // const [eanValidate, setEANValidate] = useState(false);
  // const [eanErrorMessage, setEANErrorMessage] = useState("");

  const [confirmDatesDisplay, setConfirmDatesDisplay] = useState([]);
  const [replaceConfirmDatesDisplay, setReplaceConfirmDatesDisplay] = useState(
    []
  );
  const [selectedDatesDisplay, setSelectedDatesDisplay] = useState([]);
  const [replaceSelectedDatesDisplay, setReplaceSelectedDatesDisplay] =
    useState([]);

  const [nowAvailableDates, setNowAvailableDates] = useState([]);
  const [nowUnavailableDates, setNowUnavailableDates] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(deleteAll());
  }, []);

  // toast message while advertiseToSale is true
  useEffect(() => {
    if (advertiseToSale) {
      toast(
        "Card details will be requested, However, listing an item for sale is completely free and no charge will be applied to your card at this time. You will be notified of any changes in advance.",
        {
          rtl: false,
          theme: "dark",
          draggable: true,
          autoClose: 10000,
          newestOnTop: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          position: "top-right",
          hideProgressBar: false,
          pauseOnFocusLoss: false,
        }
      );
    }
  }, [advertiseToSale]);

  // update all the fields with its value
  useEffect(() => {
    if (getObjectLength(singleAdvert) != 0) {
      setAdvertTitle(singleAdvert.name);

      setAdvertiseToHire(singleAdvert.is_for_hire === 1 ? true : false);
      setAdvertiseToSale(singleAdvert.is_for_sale === 1 ? true : false);

      dispatch(setCount(singleAdvert.photos.length));
      dispatch(addMainImage(singleAdvert.main_image));
      singleAdvert.photos.filter((obj) => {
        dispatch(addPhotos(obj));
      });

      if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 1) {
        categoriesForBothPickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            setAdvertCategory(obj.id.toString());
          }
        });
      }

      if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 0) {
        categoriesHirePickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            setAdvertCategory(obj.id.toString());
          }
        });
      }

      if (singleAdvert.is_for_hire === 0 && singleAdvert.is_for_sale === 1) {
        categoriesSalePickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            setAdvertCategory(obj.id.toString());
          }
        });
      }

      subCategoriesPickerList.filter((obj) => {
        if (obj.label === singleAdvert.sub_category) {
          setAdvertSubCategory(obj.id.toString());
        }
      });

      setMake(singleAdvert.make);
      setModel(singleAdvert.model);
      setDescription(
        singleAdvert.description != null ? singleAdvert.description : ""
      );
      setAge(singleAdvert.age != null ? singleAdvert.age.toString() : "");
      setMileage(
        singleAdvert.mileage != null ? singleAdvert.mileage.toString() : ""
      );
      setHoursUsed(
        singleAdvert.hours_used != null
          ? singleAdvert.hours_used.toString()
          : ""
      );
      setLength(
        singleAdvert.length_mm != null ? singleAdvert.length_mm.toString() : ""
      );
      setWidth(
        singleAdvert.width_mm != null ? singleAdvert.width_mm.toString() : ""
      );
      setDepth(
        singleAdvert.height_mm != null ? singleAdvert.height_mm.toString() : ""
      );

      if (singleAdvert.is_manual_address === 1) {
        setSavedAddress(false);
        setManualAddress(true);
        setManualAddressPostcode(singleAdvert.post_code);
        setPickedManualAddress(singleAdvert.location);
        setEditAdvertRadioButtonGroup("manualAddress");
      } else {
        setSavedAddress(true);
        setManualAddress(false);
        setSavedAddressPostcode(singleAdvert.post_code);
        setPickedSavedAddress(singleAdvert.location);
        setEditAdvertRadioButtonGroup("savedAddress");
      }

      setLatitude(singleAdvert.latitude.toString());
      setLongitude(singleAdvert.longitude.toString());
      setCollectionAvailable(singleAdvert.is_for_collection.toString());
      setDeliveryAvailable(singleAdvert.is_for_delivery.toString());
      setDeliveryDistance(
        singleAdvert.delivery_distance != null
          ? singleAdvert.delivery_distance.toString()
          : "Unlimited"
      );
      setDeliveryCharge(
        singleAdvert.delivery_charge_mile != null
          ? singleAdvert.delivery_charge_mile.toString()
          : ""
      );

      values[0].perDayPrice =
        singleAdvert.price_day_1 != null
          ? singleAdvert.price_day_1.toString()
          : "";
      values[1].perDayPrice =
        singleAdvert.price_day_2 != null
          ? singleAdvert.price_day_2.toString()
          : "";
      values[2].perDayPrice =
        singleAdvert.price_day_3 != null
          ? singleAdvert.price_day_3.toString()
          : "";
      values[3].perDayPrice =
        singleAdvert.price_day_4 != null
          ? singleAdvert.price_day_4.toString()
          : "";
      values[4].perDayPrice =
        singleAdvert.price_day_5 != null
          ? singleAdvert.price_day_5.toString()
          : "";
      values[5].perDayPrice =
        singleAdvert.price_day_6 != null
          ? singleAdvert.price_day_6.toString()
          : "";
      values[6].perDayPrice =
        singleAdvert.price_day_7 != null
          ? singleAdvert.price_day_7.toString()
          : "";

      setForSale(
        singleAdvert.selling_price != null
          ? singleAdvert.selling_price.toString()
          : ""
      );

      let plusVATCheckBoxSelected = singleAdvert.vat === 1 ? true : false;
      setPlusVAT(plusVATCheckBoxSelected);

      setOffersAccepted(singleAdvert.offers_accepted.toString());

      setWeight(singleAdvert?.weight ? singleAdvert.weight.toString() : "");

      setProductCode(
        singleAdvert?.product_code ? singleAdvert?.product_code : ""
      );

      setEAN(singleAdvert?.ean ? singleAdvert.ean.toString() : "");
    }
  }, [singleAdvert]);

  useEffect(() => {
    if (calendarUnavailableDateList.length > 0) {
      // console.log("calendarUnavailableDateList ==> ", calendarUnavailableDateList);

      let readyForDotUnavailableDates = [];
      let readyForSelectedUnavailableDates = [];
      for (let i = 0; i < calendarUnavailableDateList.length; i++) {
        if (calendarUnavailableDateList[i].is_booking === 1) {
          readyForDotUnavailableDates.push(calendarUnavailableDateList[i].date);
          //
        } else {
          readyForSelectedUnavailableDates.push(
            calendarUnavailableDateList[i].date
          );
        }
      }

      // console.log("DotUnavailableDates ==> ", readyForDotUnavailableDates);
      // console.log("SelectedUnavailableDates ==> ", readyForSelectedUnavailableDates);

      setConfirmDatesDisplay(readyForDotUnavailableDates);
      setReplaceConfirmDatesDisplay(readyForDotUnavailableDates);

      setSelectedDatesDisplay(readyForSelectedUnavailableDates);
      setReplaceSelectedDatesDisplay(readyForSelectedUnavailableDates);
    }
  }, [calendarUnavailableDateList]);

  // editAdvertImageUploadHandler
  const editAdvertImageUploadHandler = (e) => {
    e.preventDefault();

    dispatch(showPhotoModal(true));
  };

  // run sub category api everytime category is changed
  useEffect(() => {
    if (advertCategory != "" && advertCategory != "--Select--") {
      dispatch(subCategoriesApi(advertCategory));
    }
  }, [advertCategory]);

  // savedAddressPostcodeHandler
  const savedAddressPostcodeHandler = (val) => {
    if (addressPickerList.length > 0) {
      addressPickerList.filter((item) => {
        if (val === item.value) {
          setSavedAddressPostcode(item.postcode);
          setLatitude(item.lat);
          setLongitude(item.lon);
        }
      });
    }
  };

  // typed poscode execution
  useEffect(() => {
    if (typedPostcode) {
      setTypedPostcode(false);

      if (
        manualAddressPostcode.length >= 6 &&
        manualAddressPostcode.length < 9
      ) {
        findAddressFromPostcode(manualAddressPostcode)
          .then((res) => {
            if (res?.status === 200) {
              setLatitude(res.data.latitude);
              setLongitude(res.data.longitude);

              let addressArr = [];
              res.data.addresses.filter((obj, index) => {
                setPickedManualAddress("");
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

              dispatch(manualAddressPostcodePicker(addressArr));
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error.response);
          });
      }
    }
  }, [typedPostcode]);

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
            setManualAddressPostcode("");
            if (obj.types[0] === "postal_code") {
              let latLongFetchedAddresses = json.results;
              let latLong_postcode =
                latLongFetchedAddresses[0].formatted_address.split(",")[1];
              // console.log('latLong_postcode ==> ', latLong_postcode);

              let addressArr1 = [];
              latLongFetchedAddresses.filter((obj, index) => {
                let obj_postcode = obj.formatted_address.split(",")[1];
                // console.log('obj_postcode ==> ', obj_postcode);

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

              dispatch(manualAddressPostcodePicker(addressArr1));

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
    //     // Geocode.setLocationType("ROOFTOP");
    //     setLatitude(position.coords.latitude);
    //     setLongitude(position.coords.longitude);

    //     // Geocode.fromLatLng(53.483002, -2.2931)
    //     Geocode.fromLatLng(
    //       position.coords.latitude,
    //       position.coords.longitude
    //     ).then(
    //       (json) => {
    //         // console.log('json ==> ', json);
    //         // setLatLongFetchedAddresses(json.results);
    //         let addressComponent = json.results[0].address_components;
    //         // console.log('addressComponent ==> ', addressComponent);
    //         addressComponent.filter((obj) => {
    //           if (obj?.types) {
    //             setManualAddressPostcode("");
    //             if (obj.types[0] === "postal_code") {
    //               // setFromGeoLocation(true);

    //               let latLongFetchedAddresses = json.results;
    //               let latLong_postcode =
    //                 latLongFetchedAddresses[0].formatted_address.split(",")[1];
    //               // console.log('latLong_postcode ==> ', latLong_postcode);

    //               let addressArr1 = [];
    //               latLongFetchedAddresses.filter((obj, index) => {
    //                 let obj_postcode = obj.formatted_address.split(",")[1];
    //                 // console.log('obj_postcode ==> ', obj_postcode);

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

    //               dispatch(manualAddressPostcodePicker(addressArr1));

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
      alert("Sorry! User Location Access Is Not available.");
    }
  };

  // clearCalendarDatesHandler
  const clearCalendarDatesHandler = () => {
    setConfirmDatesDisplay(replaceConfirmDatesDisplay);
    setSelectedDatesDisplay(replaceSelectedDatesDisplay);
    setNowUnavailableDates([]);
    setNowAvailableDates([]);
  };

  const readyForMarkingUnavailableDatesHandler = (date) => {
    let formattedDate = format(new Date(date), "yyyy-MM-dd");
    // console.log("formattedDate ==> ", formattedDate);

    let supplierSelect =
      selectedDatesDisplay.length > 0 &&
      selectedDatesDisplay.includes(formattedDate);

    // console.log("supplierSelect ==> ", supplierSelect);

    if (supplierSelect) {
      let tempArr = [...selectedDatesDisplay];
      let itemIndex = selectedDatesDisplay.indexOf(formattedDate);

      if (itemIndex !== -1) {
        tempArr.splice(itemIndex, 1);
        setSelectedDatesDisplay(tempArr);
      }

      let datesForMakingAvailable = calendarUnavailableDateList.find(
        (item) => item.date === formattedDate
      );

      setNowAvailableDates((prevArray) => [
        ...prevArray,
        datesForMakingAvailable.date,
      ]);
    }

    if (!supplierSelect) {
      let nowUnavailable = false;

      nowUnavailable =
        nowUnavailableDates.length > 0 &&
        nowUnavailableDates.includes(formattedDate);

      // console.log("nowUnavailable ==> ", nowUnavailable);

      if (!nowUnavailable) {
        setNowUnavailableDates((prevArray) => [...prevArray, formattedDate]);
      }
    }
  };

  // console.log("selectedDatesDisplay ==> ", selectedDatesDisplay);
  // console.log("nowUnavailableDates ==> ", nowUnavailableDates);
  // console.log("nowAvailableDates ==> ", nowAvailableDates);

  // editAdvertHandler
  const editAdvertHandler = async (e) => {
    e.preventDefault();

    let validLength = true;
    let validWidth = true;
    let validDepth = true;
    let validForSale = true;

    const toastOption = {
      rtl: false,
      theme: "dark",
      draggable: true,
      autoClose: 3000,
      newestOnTop: true,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      position: "top-right",
      hideProgressBar: false,
      pauseOnFocusLoss: false,
    };

    if (collectionAvailable === "0" && deliveryAvailable === "0") {
      toast(
        "You cannot disable both delivery and collection available. Please enable any one of them.",
        toastOption
      );

      return;
    }

    if (!advertiseToHire && !advertiseToSale) {
      toast(
        "Please check atleast anyone of advertise for hire or advertise for sale.",
        toastOption
      );

      return;
    }

    if (mainImage == "" && photos.length < 1) {
      toast("Please upload atleast one image", toastOption);

      return;
    }

    if (length != "") {
      validLength = await LengthSchema.isValid({ length: length });
      if (!validLength) {
        toast("Please enter valid length in number", toastOption);
      }
    }

    if (width != "") {
      validWidth = await WidthSchema.isValid({ width: width });
      if (!validWidth) {
        toast("Please enter valid width in number", toastOption);
      }
    }

    if (depth != "") {
      validDepth = await DepthSchema.isValid({ depth: depth });
      if (!validDepth) {
        toast("Please enter valid depth in number", toastOption);
      }
    }

    if (advertiseToHire) {
      let tempValidateArr = [];
      values.filter((obj) => {
        if (
          obj.perDayPrice != "" &&
          !RegExp.DigitAndDecimalsOnly.test(obj.perDayPrice)
        ) {
          tempValidateArr = [...values, (obj.perDayWiseValidate = true)];

          tempValidateArr.splice(7);

          setValues(tempValidateArr);
        }
      });

      if (
        !hirePriceDayWiseValidate &&
        (values[0].perDayWiseValidate ||
          values[1].perDayWiseValidate ||
          values[2].perDayWiseValidate ||
          values[3].perDayWiseValidate ||
          values[4].perDayWiseValidate ||
          values[5].perDayWiseValidate ||
          values[6].perDayWiseValidate)
      ) {
        return;
      }

      if (!hirePriceDayWiseValidate) {
        for (let i = values.length - 1; i >= 0; i--) {
          for (let j = i - 1; j >= 0; j--) {
            if (
              parseFloat(values[i].perDayPrice) <
              parseFloat(values[j].perDayPrice)
            ) {
              setPerDayWiseValidateText(
                `hire_price associated to day ${
                  i + 1
                } must be greater than hire_price associated to day ${j + 1}.`
              );

              return;
            }
          }
        }
      }

      if (
        !hirePriceDayWiseValidate &&
        values[0].perDayPrice === "" &&
        values[1].perDayPrice === "" &&
        values[2].perDayPrice === "" &&
        values[3].perDayPrice === "" &&
        values[4].perDayPrice === "" &&
        values[5].perDayPrice === "" &&
        values[6].perDayPrice === ""
      ) {
        setPerDayPriceValidate("At least one day rate must be entered.");
        return;
      }
    }

    if (advertiseToSale) {
      validForSale = await ForSaleSchema.isValid({ forSale: forSale });
      validForSale ? setForSaleValidate(false) : setForSaleValidate(true);
    }

    if (validLength && validWidth && validDepth && validForSale) {
      let obj = {
        id: singleAdvert.id,
        navigate: navigate,
        _method: "PUT",
        name: advertTitle,
        is_for_hire: advertiseToHire === true ? "1" : "0",
        is_for_sale: advertiseToSale === true ? "1" : "0",
        // photos: photos,
        // main_image: mainImage,
        category_id: advertCategory,
        sub_category_id: advertSubCategory,
        make: make,
        model: model,
        description: description,
        age: age != "" ? parseInt(age) : "",
        mileage: mileage,
        hours_used: hoursUsed,
        length_mm: length,
        width_mm: width,
        height_mm: depth,
        is_manual_address:
          editAdvertRadioButtonGroup === "manualAddress" ? 1 : 0,
        location: savedAddress ? pickedSavedAddress : pickedManualAddress,
        post_code: savedAddress ? savedAddressPostcode : manualAddressPostcode,
        latitude: latitude,
        longitude: longitude,
        is_for_collection: collectionAvailable,
        is_for_delivery: deliveryAvailable,
        delivery_distance:
          deliveryDistance !== "Unlimited" ? deliveryDistance : null,
        delivery_charge_mile: deliveryAvailable === "0" ? null : deliveryCharge,
        price_day_1: !hirePriceDayWiseValidate ? values[0].perDayPrice : "",
        price_day_2: !hirePriceDayWiseValidate ? values[1].perDayPrice : "",
        price_day_3: !hirePriceDayWiseValidate ? values[2].perDayPrice : "",
        price_day_4: !hirePriceDayWiseValidate ? values[3].perDayPrice : "",
        price_day_5: !hirePriceDayWiseValidate ? values[4].perDayPrice : "",
        price_day_6: !hirePriceDayWiseValidate ? values[5].perDayPrice : "",
        price_day_7: !hirePriceDayWiseValidate ? values[6].perDayPrice : "",
        weight: weight,
        product_code: productCode,
        ean: ean,
        vat: advertiseToSale ? (plusVAT ? 1 : 0) : 0,
        selling_price: advertiseToSale ? forSale : null,
        offers_accepted: advertiseToSale ? offersAccepted : "0",
        // accepted_terms_and_conditions: checkBox ? "1" : "0",
      };

      // console.log("obj --> ", obj);
      dispatch(editAdvertApi(obj));
    }

    if (nowUnavailableDates.length > 0) {
      let obj = {
        id: singleAdvert.id,
        dates: nowUnavailableDates,
      };

      dispatch(calendarDatesMakingUnavailableApi(obj));
    }

    if (nowAvailableDates.length > 0) {
      let obj = {
        id: singleAdvert.id,
        dates: nowAvailableDates,
      };

      dispatch(calendarDateDeleteByIdApi(obj));
    }
  };

  const handleChange = (i, e) => {
    // console.log("i, e ==> ", i, e);

    let tempArr = [];
    values.forEach((item, index) => {
      if (item.id == i) {
        tempArr = [
          ...values,
          (values[index].perDayPrice = e.target.value),
          (values[index].perDayWiseValidate = false),
        ];
      }
    });

    tempArr.splice(7);
    // console.log('termpArr ==> ', tempArr);

    setValues(tempArr);
    setPerDayPriceValidate("");
    setPerDayWiseValidateText("");
  };

  let tabularPerDayPrice = [];
  for (let i = 0; i <= 6; i++) {
    tabularPerDayPrice.push(
      <div key={i} className="col-md-3 col-6">
        <span className="span-post-advert">{`${i + 1} Day (optional)`}</span>

        <FaPoundSign className="pound-icon-pa" />
        <input
          disabled={advertiseToHire ? false : true}
          type="text"
          className={`txtbox mr-3 pl-5 mt-3 ${
            advertiseToHire ? "" : "disabled"
          }`}
          placeholder={`E.g ${80 + i}`}
          readOnly={hirePriceDayWiseValidate ? true : false}
          name={values[i].perDayPrice}
          value={values[i].perDayPrice}
          onChange={handleChange.bind(this, i)}
          style={values[i].perDayWiseValidate ? { borderColor: "red" } : null}
          // required={i + 1 != 1 ? false : true}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <a className="back py-3 mt-5" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </a>

      <h2 className="py-3">
        <b>Edit an Advert</b>
      </h2>

      <form onSubmit={editAdvertHandler}>
        {/* Advert title */}
        <div className="form-input">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6 col-12">
                <label htmlFor="adTitle">Advert title *</label>

                <br />

                <input
                  type="text"
                  className="txtbox"
                  placeholder="Enter advert title"
                  name="advertTitle"
                  value={advertTitle}
                  onChange={(e) => setAdvertTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-3 col-6">
                <br />

                <input
                  type="checkbox"
                  htmlFor="hire"
                  // defaultValue="hire"
                  name="advertiseToHire"
                  checked={advertiseToHire}
                  onChange={(e) => {
                    setAdvertiseToHire(e.target.checked);
                    if (!e.target.checked) {
                      setHirePriceDayWiseValidate(true);
                    }

                    if (e.target.checked) {
                      setHirePriceDayWiseValidate(false);
                    }

                    setValues([
                      {
                        id: 0,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 1,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 2,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 3,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 4,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 5,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                      {
                        id: 6,
                        perDayPrice: "",
                        perDayWiseValidate: false,
                      },
                    ]);
                  }}
                />

                <label htmlFor="hire"> Advertise for hire *</label>
              </div>

              <div className="col-lg-3 col-6">
                <br />

                <input
                  type="checkbox"
                  htmlFor="sale"
                  // defaultValue="sale"
                  name="advertiseToSale"
                  checked={advertiseToSale}
                  onChange={(e) => {
                    setAdvertiseToSale(e.target.checked);
                    setForSale("");
                    setOffersAccepted("");
                  }}
                />

                <label htmlFor="sale"> Advertise for sale *</label>
              </div>
            </div>
          </div>

          <hr className="mt-4 mb-2" />

          {/* image */}
          <h5 className="pt-3">
            <b>Image Gallery</b>
          </h5>

          <div className="form-input">
            {/* input image here */}
            {/* <input type="img" htmlFor="img" defaultValue="Add Images" /> */}

            <div
              className="image-upload"
              onClick={editAdvertImageUploadHandler}
            >
              <label htmlFor="file-input">
                <i className="fa fa-picture-o add-icons" aria-hidden="true"></i>
                <i className="fa fa-plus-circle add-images" aria-hidden="true">
                  Add Images
                </i>

                {mainImage != "" && (
                  <img
                    className="added-image"
                    alt="not found"
                    src={mainImage}
                  />
                )}
              </label>

              <div
                className="input-image"
                type="file"
                multiple
                accept="image/*"
                id="file-input"
                name="file"
                // onChange={(e) => {
                //   dispatch(deleteAll());
                //   imageUploadHandler(e);
                // }}
              />
            </div>
          </div>

          <hr className="mt-4 mb-2" />

          {/* Item Details */}
          <h5 className="py-3">
            <b>Item Details</b>
          </h5>

          <div className="container-fluid">
            <div className="row pb-3">
              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Advert Category *</span>

                <div className="select mt-3">
                  <select
                    // className="form-select dropdown-btn dropdown-btn-edit pl-3 mt-3"
                    value={advertCategory}
                    onChange={(e) => {
                      e.preventDefault();
                      setAdvertCategory(e.target.value);
                      setAdvertSubCategory("");
                    }}
                    required
                  >
                    {!advertiseToHire &&
                    !advertiseToSale &&
                    categoriesPickerList.length > 0
                      ? categoriesPickerList.map((obj, index) => {
                          return (
                            <option key={index} value={obj.value}>
                              {obj.label}
                            </option>
                          );
                        })
                      : []}

                    {advertiseToHire &&
                    advertiseToSale &&
                    categoriesForBothPickerList.length > 0
                      ? categoriesForBothPickerList.map((obj, index) => {
                          return (
                            <option key={index} value={obj.value}>
                              {obj.label}
                            </option>
                          );
                        })
                      : []}

                    {advertiseToHire &&
                    !advertiseToSale &&
                    categoriesHirePickerList.length > 0
                      ? categoriesHirePickerList.map((obj, index) => {
                          return (
                            <option key={index} value={obj.value}>
                              {obj.label}
                            </option>
                          );
                        })
                      : []}

                    {!advertiseToHire &&
                    advertiseToSale &&
                    categoriesSalePickerList.length > 0
                      ? categoriesSalePickerList.map((obj, index) => {
                          return (
                            <option key={index} value={obj.value}>
                              {obj.label}
                            </option>
                          );
                        })
                      : []}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Sub Category *</span>

                <div className="select mt-3">
                  <select
                    //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                    value={advertSubCategory}
                    onChange={(e) => {
                      setAdvertSubCategory(e.target.value);
                    }}
                    required
                  >
                    {subCategoriesPickerList.map((obj, index) => {
                      return (
                        <option key={index} value={obj.value}>
                          {obj.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Make *</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g JCB"
                  name="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Model *</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 8008 CTS"
                  name="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row pb-3">
              <div className="col-12">
                <span className="span-post-advert">Description (optional)</span>

                <textarea
                  name="text"
                  className="txtbox txtarea mr-3 mt-3"
                  placeholder="Describe the condition and key features of your item"
                  // name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="row pb-3">
              <div className="col-lg-3 col-md-4 col-12">
                <span className="span-post-advert">Age (YOM) (optional)</span>

                <div className="select mt-3">
                  <select
                    //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  >
                    {constantYears.map((obj, index) => {
                      return (
                        <option key={index} value={obj.value}>
                          {obj.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 col-md-4 col-12">
                <span className="span-post-advert">Mileage (optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 9500"
                  name="mileage"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>

              <div className="col-lg-3 col-md-4 col-12">
                <span className="span-post-advert">Hours Used (optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 300"
                  name="hoursUsed"
                  value={hoursUsed}
                  onChange={(e) => setHoursUsed(e.target.value)}
                />
              </div>

              <div className="col-lg-3 col-md-12 col-12">
                <span className="span-post-advert">
                  Dimensions (in CM) (optional)
                </span>

                <div className="container">
                  <div className="row">
                    <div className="col-4 pl-0">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="L"
                        name="length"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>

                    <div className="col-4 px-2">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="W"
                        name="width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>

                    <div className="col-4 pr-0">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="D"
                        name="depth"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* Item Location and Collection / Delivery */}
          <h5 className="py-3">
            <b>Item Location and Collection / Delivery</b>
          </h5>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <span className="span-post-advert">Item Location *</span>

                <br />
                <br />

                <input
                  type="radio"
                  name="editAdvertRadio"
                  id="editAdvertRadio1"
                  value={editAdvertRadioButtonGroup}
                  onChange={(e) => {
                    setSavedAddress(true);
                    setManualAddress(false);
                    setEditAdvertRadioButtonGroup("savedAddress");
                  }}
                  checked={editAdvertRadioButtonGroup == "savedAddress"}
                />

                <label htmlFor="editAdvertRadio1">Saved Address</label>

                <input
                  type="radio"
                  className="ml-5"
                  name="editAdvertRadio"
                  id="manualAddress"
                  value={editAdvertRadioButtonGroup}
                  onChange={(e) => {
                    setSavedAddress(false);
                    setManualAddress(true);
                    setEditAdvertRadioButtonGroup("manualAddress");
                  }}
                  checked={editAdvertRadioButtonGroup == "manualAddress"}
                />

                <label htmlFor="manualAddress">Manual Address</label>
              </div>
            </div>

            {savedAddress && (
              <div className="row pb-3">
                <div className="col-md-6 col-12">
                  <div className="select mt-3">
                    <select
                      //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
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

            {manualAddress && (
              <div className="row pb-3">
                <div className="col-md-3 col-12">
                  <input
                    type="text"
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

                  <div className="icon-position1" onClick={myPostcodeHandler}>
                    <MdMyLocation color="#ff6100" />
                  </div>
                </div>

                <div className="col-md-3 col-12">
                  <div className="select mt-3">
                    <select
                      //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                      value={pickedManualAddress}
                      onChange={(e) => {
                        setPickedManualAddress(e.target.value);
                      }}
                      required
                    >
                      {manualAddressPickerOfPostcode.map((obj, index) => {
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

            <div className="row pb-3">
              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Collection Available *</span>

                <div className="select mt-3">
                  <select
                    //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                    value={collectionAvailable}
                    onChange={(e) => {
                      setCollectionAvailable(e.target.value);
                    }}
                    required
                  >
                    {YesNo.map((obj, index) => {
                      return (
                        <option key={index} value={obj.value}>
                          {obj.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Delivery Available *</span>

                <div className="select mt-3">
                  <select
                    //className="btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3"
                    value={deliveryAvailable}
                    onChange={(e) => {
                      setDeliveryAvailable(e.target.value);
                      if (e.target.value === "0") {
                        setDeliveryDistance("");
                        setDeliveryCharge("");
                      }
                    }}
                    required
                  >
                    {YesNo.map((obj, index) => {
                      return (
                        <option key={index} value={obj.value}>
                          {obj.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Delivery Distance *</span>

                <div 
                    className={`select mt-3 ${
                      deliveryAvailable === "0" ? "disabled" : ""
                    }`}>
                  <select
                    disabled={deliveryAvailable === "0" ? true : false}
                    /* className={`btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3${
                      deliveryAvailable === "0" ? "disabled" : ""
                    }`} */
                    value={deliveryDistance}
                    onChange={(e) => {
                      setDeliveryDistance(e.target.value);
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

              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">
                  Delivery Charge (per mile) *
                </span>

                <input
                  type="text"
                  disabled={deliveryAvailable === "0" ? true : false}
                  className={`txtbox mr-3 mt-3 ${
                    deliveryAvailable === "0" ? "disabled" : ""
                  }`}
                  placeholder=" E.g 2.50"
                  name="deliveryCharge"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Hire Price */}
          <h5 className="py-3">
            <b>Hire Price</b>
          </h5>

          <p>
            Please enter rates for hire periods. Customers will only be
            permitted to hire for valid combinations of days based on these
            rates. Any of all rates can be included as long as there is at least
            one entry.
          </p>

          <div className="container-fluid">
            <div className="row pb-3">
              {tabularPerDayPrice}

              {perDayWiseValidateText != "" && (
                <p style={{ color: "red" }}>{perDayWiseValidateText}</p>
              )}
            </div>

            {perDayPriceValidate != "" && (
              <p style={{ color: "red" }}>{perDayPriceValidate}</p>
            )}
          </div>

          <hr />

          {/* Selling Price */}
          <h5 className="py-3">
            <b>Selling Price</b>
          </h5>

          <div className="container-fluid">
            <div className="row pb-3">
              <div className="col-md-4 col-12">
                <span className="span-post-advert">For sale price *</span>

                <input
                  disabled={advertiseToSale ? false : true}
                  type="text"
                  className={`txtbox mr-3 mt-3 ${
                    advertiseToSale ? "" : "disabled"
                  }`}
                  placeholder="Enter a sale price"
                  name="forSale"
                  value={forSale}
                  onChange={(e) => {
                    setForSale(e.target.value);
                    setForSaleValidate(false);
                  }}
                  required
                />

                {forSaleValidate && (
                  <p style={{ color: "red" }}>
                    Please provide valid sale price
                  </p>
                )}
              </div>

              {advertiseToSale && (
                <div className="col-md-4 col-12 pl-5 vat-advert">
                  <span className="span-post-advert">Plus VAT(Optional)</span>
                  <br /> <br />
                  <input
                    type="checkbox"
                    htmlFor="Plus VAT"
                    name="plusVAT"
                    checked={plusVAT}
                    onChange={(e) => setPlusVAT(e.target.checked)}
                  />
                  <label htmlFor="Plus Vat">Plus VAT</label>
                </div>
              )}

              <div className="col-md-3 col-12">
                <span className="span-post-advert">Offers accepted *</span>

                <div 
                    className={`select mt-3 ${
                      advertiseToSale ? "" : "disabled"
                    }`}>
                  <select
                    disabled={advertiseToSale ? false : true}
                    /* className={`btn dropdown-toggle dropdown-btn dropdown-btn-edit mt-3 ${
                      advertiseToSale ? "" : "disabled"
                    }`} */
                    value={offersAccepted}
                    onChange={(e) => {
                      setOffersAccepted(e.target.value);
                    }}
                    required
                  >
                    {YesNo.map((obj, index) => {
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

          <hr />

          {/* Additional Item Details */}
          <h5 className="py-3">
            <b>Additional Item Details</b>
          </h5>

          <div className="container-fluid">
            <div className="row pb-3">
              <div className="col-md-4 col-12">
                <span className="span-post-advert">
                  Weight (KG/TONNES) (optional)
                </span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 10"
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="col-md-4 col-12">
                <span className="span-post-advert">
                  Product Code (Optional)
                </span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g CEX56"
                  name="productCode"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </div>

              <div className="col-md-4 col-12">
                <span className="span-post-advert">EAN (Optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 12654"
                  name="ean"
                  value={ean}
                  onChange={(e) => setEAN(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Availability Calendar */}
          <div className="row">
            <div className="col-12 col-md-9 col-lg-5">
              <h5 className="py-3 inline-block">
                <b>Availability Calendar</b>
              </h5>
            </div>

            {/* {nowUnavailableDates.length > 0 && ( */}
            <div className="pt-4 col-12 col-md-3 col-lg-3">
              <a
                className="text-orange pointer"
                onClick={clearCalendarDatesHandler}
              >
                <AiOutlineReload />
                &nbsp;
                <b>Clear dates</b>
              </a>
            </div>
            {/* )} */}
          </div>

          <div className="container-fluid">
            <div className="card card-calendar mb-3">
              <div className="card-body">
                <HTCalendar
                  confirmDatesDisplay={confirmDatesDisplay}
                  selectedDatesDisplay={selectedDatesDisplay}
                  nowUnavailableDates={nowUnavailableDates}
                  onChange={(day) =>
                    readyForMarkingUnavailableDatesHandler(day)
                  }
                />

                {/* <Calendar
                  minDetail="month"
                  defaultView="month"
                  minDate={new Date()}
                  next2Label={null}
                  next2AriaLabel=""
                  prev2Label={null}
                  prev2AriaLabel=""
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
                    // now unavailable dates
                    if (
                      view === "month" &&
                      nowUnavailableDates?.length > 0 &&
                      nowUnavailableDates.find((BookedDate) => {
                        // console.log("date ==> ", date);
                        // console.log("BookedDate ==> ", parseISO(BookedDate));
                        // console.log("isSameDay ==> ", isSameDay(parseISO(BookedDate), date));

                        return isSameDay(parseISO(BookedDate), date);
                      })
                    ) {
                      return "highlight";
                    }

                    // selected dates display
                    if (
                      view === "month" &&
                      selectedDatesDisplay?.length > 0 &&
                      selectedDatesDisplay.find((BookedDate) => {
                        let repeatedDate = format(new Date(date), "yyyy-MM-dd");

                        // console.log("BookedDate ==> ", BookedDate);
                        // console.log("repeatedDate ==> ", repeatedDate);

                        return repeatedDate === BookedDate;
                      })
                    ) {
                      return "highlight";
                    }
                  }}
                  tileContent={({ activeStartDate, date, view }) => {
                    // display customer booked dates
                    if (
                      view === "month" &&
                      confirmDatesDisplay?.length > 0 &&
                      confirmDatesDisplay.find((BookedDate) =>
                        isSameDay(parseISO(BookedDate), date)
                      )
                    ) {
                      return <i className="highlight-dot"></i>;
                    }
                  }}
                  onChange={(day) =>
                    readyForMarkingUnavailableDatesHandler(day)
                  }
                /> */}
              </div>
            </div>
          </div>

          <span className="span-post-advert">
            {" "}
            <div className="row">
              <div className="col-6 col-lg-3">
                <i className="dot" /> Bookings
              </div>

              <div className="col-6">
                <i className="dot-red" /> Marked Unavailable
              </div>
            </div>
          </span>

          <br />
          <br />

          <button
            className="btn advert-btn flamabold"
            type="submit"
            // form="form"
            value="Submit"
          >
            UPDATE ADVERT
          </button>
        </div>
      </form>

      {isPhotoModalVisible && (
        <PhotoModal screen="EDITADVERT" advertId={singleAdvert.id} />
      )}
    </div>
  );
};

export { EditAdvert };
