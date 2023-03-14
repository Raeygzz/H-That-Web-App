import React, { useState, useEffect, useCallback, useMemo } from "react";

import Geocode from "react-geocode";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPoundSign } from "react-icons/fa";

import "./PostAdvert.css";
import { RegExp, getYears } from "../../utils";
import { YesNo, Distance } from "../../constants/Constant";
import { PhotoModal } from "../../shared/pages_common/modal";
import { findAddressFromPostcode } from "../../services/axios/Api";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";
import {
  TitleSchema,
  CategorySchema,
  SubCategorySchema,
  DescriptionSchema,
  AgeSchema,
  LengthSchema,
  WidthSchema,
  DepthSchema,
  LocationSchema,
  ManualAddressLocationSchema,
  ManualAddressFromPostcodeSchema,
  CollectionAvailableSchema,
  DeliveryAvailableSchema,
  DeliveryDistanceSchema,
  MakeSchema,
  ModelSchema,
  DeliveryChargeSchema,
  PerDaySchema,
  PerWeekSchema,
  WeightSchema,
  ForSaleSchema,
  OffersAcceptedSchema,
} from "../../shared/validations/PostAdvert";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../toolkit/features/AuthSlice";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { addressListApi } from "../../toolkit/features/AddressSlice";
import { getStripeConnectApi } from "../../toolkit/features/PaymentSlice";
import { manualAddressPostcodePicker } from "../../toolkit/features/AdvertsSlice";
import {
  showPhotoModal,
  createAdvertApi,
} from "../../toolkit/features/AdvertsSlice";
import {
  categoriesApi,
  subCategoriesApi,
} from "../../toolkit/features/CategoriesSlice";
import {
  addMainImage,
  addPhotos,
  deleteAll,
  setCount,
} from "../../toolkit/features/AdvertPhotosSlice";

// react-dropzone styles
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "265px",
  borderWidth: "2px",
  borderRadius: "12px",
  borderColor: "rgb(238, 238, 238)",
  backgroundColor: "rgb(238, 238, 238)",
  color: "rgb(189, 189, 189)",
  outline: "none",
  transition: "border 0.24s ease-in-out 0s",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const PostAdvert = (props) => {
  const {} = props;

  const { addressPickerList } = useSelector((state) => state.address);
  const { categoriesPickerList } = useSelector((state) => state.categories);
  const { subCategoriesPickerList } = useSelector((state) => state.categories);
  const { categoriesHirePickerList } = useSelector((state) => state.categories);
  const { categoriesSalePickerList } = useSelector((state) => state.categories);
  const { categoriesForBothPickerList } = useSelector(
    (state) => state.categories
  );
  const { user } = useSelector((state) => state.auth);
  const { photos } = useSelector((state) => state.advertPhotos);
  const { mainImage } = useSelector((state) => state.advertPhotos);
  const { photosCount } = useSelector((state) => state.advertPhotos);
  const { isPhotoModalVisible } = useSelector((state) => state.adverts);
  const { has_primary_card } = useSelector((state) => state.auth.user);
  const { redirectUrl } = useSelector((state) => state.payment);
  const { completed_stripe_onboarding } = useSelector(
    (state) => state.auth.user
  );
  const { manualAddressPickerOfPostcode } = useSelector(
    (state) => state.adverts
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
  const [postAdvertRadioButtonGroup, setPostAdvertRadioButtonGroup] =
    useState("savedAddress");
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

  // terms & condition checkbox
  const [checkBox, setCheckBox] = useState(false);

  const [perDayPriceValidate, setPerDayPriceValidate] = useState("");
  const [perDayWiseValidateText, setPerDayWiseValidateText] = useState("");
  const [hirePriceDayWiseValidate, setHirePriceDayWiseValidate] =
    useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDrop = useCallback(
    (acceptedFiles) => {
      // console.log("acceptedFiles ==> ", acceptedFiles);
      // console.log("acceptedFiles.length ==> ", acceptedFiles.length);

      if (photosCount + acceptedFiles.length > 5) {
        toast("Only five photos are allowed to add in gallery.", {
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
        });

        // document.getElementById("file-input1").value = "";
        return;
      }

      if (photosCount + acceptedFiles.length == 1) {
        let reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);

        reader.onload = function () {
          dispatch(setCount(photosCount + 1));
          dispatch(addMainImage(reader.result));
          dispatch(addPhotos(reader.result));
          // document.getElementById("file-input1").value = "";
        };

        reader.onerror = function (error) {
          console.log("Error ==> ", error);
        };
      }

      if (
        photosCount + acceptedFiles.length > 1 &&
        photosCount + acceptedFiles.length < 6
      ) {
        for (let i = 0; i < acceptedFiles.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(acceptedFiles[i]);

          reader.onload = function () {
            dispatch(addPhotos(reader.result));
            // document.getElementById("file-input1").value = "";
          };

          reader.onerror = function (error) {
            console.log("Error ==> ", error);
          };
        }

        dispatch(setCount(photosCount + acceptedFiles.length));
        dispatch(showPhotoModal(true));
      }
    },
    [photosCount]
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    // acceptedFiles,
  } = useDropzone({ onDrop, multiple: true, accept: "image/*" });

  // react-dropzone
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    dispatch(deleteAll());

    if (completed_stripe_onboarding != 1) {
      dispatch(getStripeConnectApi("post-advert"));
    }

    if (JSON.parse(localStorage.getItem("postAdvertData")) != null) {
      dispatch(categoriesApi());
      dispatch(addressListApi());
    }
  }, []);

  useEffect(() => {
    let postAdvertData = JSON.parse(localStorage.getItem("postAdvertData"));
    // console.log("postAdvertData ==> ", postAdvertData);

    if (postAdvertData != null) {
      setAdvertTitle(postAdvertData.name);

      setAdvertiseToHire(postAdvertData.is_for_hire);
      setAdvertiseToSale(postAdvertData.is_for_sale);

      dispatch(setCount(postAdvertData.photos.length));
      dispatch(addMainImage(postAdvertData.main_image));
      postAdvertData.photos.filter((obj) => {
        dispatch(addPhotos(obj));
      });

      setAdvertCategory(postAdvertData.category_id);
      setAdvertSubCategory(postAdvertData.sub_category_id);

      setMake(postAdvertData.make);
      setModel(postAdvertData.model);
      setDescription(postAdvertData.description);
      setAge(postAdvertData.age);
      setMileage(postAdvertData.mileage);
      setHoursUsed(postAdvertData.hours_used);
      setLength(postAdvertData.length_mm);
      setWidth(postAdvertData.width_mm);
      setDepth(postAdvertData.height_mm);

      if (postAdvertData.is_manual_address === 1) {
        setSavedAddress(false);
        setManualAddress(true);
        setManualAddressPostcode(postAdvertData.post_code);
        setPickedManualAddress(postAdvertData.location);
        setPostAdvertRadioButtonGroup("manualAddress");

        findAddressFromPostcode(postAdvertData.post_code)
          .then((res) => {
            if (res?.status === 200) {
              let addressArr = [];
              res.data.addresses.filter((obj, index) => {
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
        //
      } else {
        setSavedAddress(true);
        setManualAddress(false);
        setSavedAddressPostcode(postAdvertData.post_code);
        setPickedSavedAddress(postAdvertData.location);
        setPostAdvertRadioButtonGroup("savedAddress");
      }

      setLatitude(postAdvertData.latitude);
      setLongitude(postAdvertData.longitude);
      setCollectionAvailable(postAdvertData.is_for_collection);
      setDeliveryAvailable(postAdvertData.is_for_delivery);
      setDeliveryDistance(
        postAdvertData.delivery_distance != null
          ? postAdvertData.delivery_distance.toString()
          : "Unlimited"
      );
      setDeliveryCharge(
        postAdvertData.delivery_charge_mile != null
          ? postAdvertData.delivery_charge_mile.toString()
          : ""
      );

      values[0].perDayPrice = postAdvertData.price_day_1;
      values[1].perDayPrice = postAdvertData.price_day_2;
      values[2].perDayPrice = postAdvertData.price_day_3;
      values[3].perDayPrice = postAdvertData.price_day_4;
      values[4].perDayPrice = postAdvertData.price_day_5;
      values[5].perDayPrice = postAdvertData.price_day_6;
      values[6].perDayPrice = postAdvertData.price_day_7;

      setForSale(postAdvertData.selling_price);

      setPlusVAT(postAdvertData.vat);

      setOffersAccepted(postAdvertData.offers_accepted);

      setWeight(postAdvertData.weight);

      setProductCode(postAdvertData.product_code);

      setEAN(postAdvertData.ean);
    }
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

  // // imageUploadHandler
  // const imageUploadHandler = (e) => {
  //   e.preventDefault();

  //   if (photosCount + e.target.files.length > 5) {
  //     toast("Only five photos are allowed to add in gallery.", {
  //       rtl: false,
  //       theme: "dark",
  //       draggable: true,
  //       autoClose: 3000,
  //       newestOnTop: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       progress: undefined,
  //       position: "top-right",
  //       hideProgressBar: false,
  //       pauseOnFocusLoss: false,
  //     });

  //     document.getElementById("file-input1").value = "";
  //     return;
  //   }

  //   if (photosCount + e.target.files.length == 1) {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(e.target.files[0]);

  //     reader.onload = function () {
  //       dispatch(setCount(photosCount + 1));
  //       dispatch(addMainImage(reader.result));
  //       dispatch(addPhotos(reader.result));
  //       document.getElementById("file-input1").value = "";
  //     };

  //     reader.onerror = function (error) {
  //       console.log("Error ==> ", error);
  //     };
  //   }

  //   if (
  //     photosCount + e.target.files.length > 1 &&
  //     photosCount + e.target.files.length < 6
  //   ) {
  //     for (let i = 0; i < e.target.files.length; i++) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(e.target.files[i]);

  //       reader.onload = function () {
  //         dispatch(addPhotos(reader.result));
  //         document.getElementById("file-input1").value = "";
  //       };

  //       reader.onerror = function (error) {
  //         console.log("Error ==> ", error);
  //       };
  //     }

  //     dispatch(setCount(photosCount + e.target.files.length));
  //     dispatch(showPhotoModal(true));
  //   }
  // };

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
                // setManualAddressPickerOfPostcode([]);
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

              // setManualAddressPickerOfPostcode(addressArr);
              dispatch(manualAddressPostcodePicker(addressArr));
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error.response);
          });
      }
    }
  }, [typedPostcode]);

  // fromGeoLocation
  // useEffect(() => {
  //   if (fromGeoLocation) {
  //     setFromGeoLocation(false);

  //     let latLong_postcode =
  //       latLongFetchedAddresses[0].formatted_address.split(",")[1];
  //     // console.log('latLong_postcode ==> ', latLong_postcode);

  //     let addressArr1 = [];
  //     latLongFetchedAddresses.filter((obj, index) => {
  //       setManualAddressPickerOfPostcode([]);
  //       let obj_postcode = obj.formatted_address.split(",")[1];
  //       // console.log('obj_postcode ==> ', obj_postcode);

  //       if (obj_postcode !== undefined && latLong_postcode === obj_postcode) {
  //         addressArr1.push({
  //           id: index,
  //           label: obj.formatted_address.split(",")[0],
  //           value: obj.formatted_address.split(",")[0],
  //         });
  //       }
  //     });

  //     addressArr1.unshift({
  //       id: "-1",
  //       label: "--Select--",
  //       value: "",
  //     });

  //     setManualAddressPickerOfPostcode(addressArr1);
  //   }
  // }, [fromGeoLocation]);

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
              // setFromGeoLocation(true);

              let latLongFetchedAddresses = json.results;
              let latLong_postcode =
                latLongFetchedAddresses[0].formatted_address.split(",")[1];
              // console.log('latLong_postcode ==> ', latLong_postcode);

              let addressArr1 = [];
              latLongFetchedAddresses.filter((obj, index) => {
                // setManualAddressPickerOfPostcode([]);
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

              // setManualAddressPickerOfPostcode(addressArr1);
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
    //                 // setManualAddressPickerOfPostcode([]);
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

    //               // setManualAddressPickerOfPostcode(addressArr1);
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

  // createAdvertHandler
  const createAdvertHandler = async (e) => {
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

      // console.log("values ==> ", values);
      // console.log("tempValidateArr ==> ", tempValidateArr);
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
              // console.log('i ==> ', values[i].perDayPrice);
              // console.log('j ==> ', values[j].perDayPrice);
              // console.log(
              // `per_day_price_${i + 1} must be greater than per_day_price_${
              //   j + 1
              // }.`;
              // );

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

    if (
      validLength &&
      validWidth &&
      validDepth &&
      validForSale &&
      advertiseToHire &&
      completed_stripe_onboarding !== 1
    ) {
      setCheckBox(false);

      let modalConfig = {
        title: "Wait!",
        message:
          "Please connect the stripe account to your Hire That account so we can protect you and your money.",
        shouldRunFunction: true,
        functionHandler: "stripeConnectFillUpHandler",
        shouldCallback: () => stripeConnectFillUpHandler(),
      };

      dispatch(presentModal(modalConfig));
      return;
    }

    if (
      validLength &&
      validWidth &&
      validDepth &&
      validForSale &&
      advertiseToSale &&
      has_primary_card != 1
    ) {
      setCheckBox(false);

      // post advert locat storage
      let postAdvertData = {
        name: advertTitle,
        is_for_hire: advertiseToHire,
        is_for_sale: advertiseToSale,
        photos: photos,
        main_image: mainImage,
        category_id: advertCategory,
        sub_category_id: advertSubCategory,
        make: make,
        model: model,
        description: description,
        age: age,
        mileage: mileage,
        hours_used: hoursUsed,
        length_mm: length,
        width_mm: width,
        height_mm: depth,
        is_manual_address:
          postAdvertRadioButtonGroup === "manualAddress" ? 1 : 0,
        location: savedAddress ? pickedSavedAddress : pickedManualAddress,
        post_code: savedAddress ? savedAddressPostcode : manualAddressPostcode,
        latitude: latitude,
        longitude: longitude,
        is_for_collection: collectionAvailable,
        is_for_delivery: deliveryAvailable,
        delivery_distance:
          deliveryDistance !== "Unlimited" ? deliveryDistance : null,
        delivery_charge_mile: deliveryCharge,
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
        vat: plusVAT,
        selling_price: forSale,
        offers_accepted: offersAccepted,
        accepted_terms_and_conditions: checkBox,
      };

      localStorage.setItem("postAdvertData", JSON.stringify(postAdvertData));

      navigate("/add-card");
      // window.open("/add-card", "_blank", "noopener,noreferrer");
      return;
    }

    if (validLength && validWidth && validDepth && validForSale) {
      let obj = {
        navigate: navigate,
        from: "PostAdvert",
        name: advertTitle,
        is_for_hire: advertiseToHire === true ? "1" : "0",
        is_for_sale: advertiseToSale === true ? "1" : "0",
        photos: photos,
        main_image: mainImage,
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
          postAdvertRadioButtonGroup === "manualAddress" ? 1 : 0,
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
        accepted_terms_and_conditions: checkBox ? "1" : "0",
      };

      console.log("post-advert-obj --> ", obj);
      dispatch(createAdvertApi(obj));
    }
  };

  // stripeConnectFillUpHandler
  const stripeConnectFillUpHandler = () => {
    // post advert locat storage
    let postAdvertData = {
      name: advertTitle,
      is_for_hire: advertiseToHire,
      is_for_sale: advertiseToSale,
      photos: photos,
      main_image: mainImage,
      category_id: advertCategory,
      sub_category_id: advertSubCategory,
      make: make,
      model: model,
      description: description,
      age: age,
      mileage: mileage,
      hours_used: hoursUsed,
      length_mm: length,
      width_mm: width,
      height_mm: depth,
      is_manual_address: postAdvertRadioButtonGroup === "manualAddress" ? 1 : 0,
      location: savedAddress ? pickedSavedAddress : pickedManualAddress,
      post_code: savedAddress ? savedAddressPostcode : manualAddressPostcode,
      latitude: latitude,
      longitude: longitude,
      is_for_collection: collectionAvailable,
      is_for_delivery: deliveryAvailable,
      delivery_distance:
        deliveryDistance !== "Unlimited" ? deliveryDistance : null,
      delivery_charge_mile: deliveryCharge,
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
      vat: plusVAT,
      selling_price: forSale,
      offers_accepted: offersAccepted,
      accepted_terms_and_conditions: checkBox,
    };

    // user data for set user and localstorage
    let userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      login_with: user.login_with,
      completed_stripe_onboarding: 1,
      has_primary_card: user.has_primary_card,
      has_primary_address: user.has_primary_address,
      has_business_profile: user.has_business_profile,
    };

    dispatch(setUser(userData));

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("postAdvertData", JSON.stringify(postAdvertData));

    // window.open(redirectUrl);
    window.location.replace(redirectUrl);
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
        {/* <i className="fas fa-arrow-left" /> Back */}
      </a>
      <h2 className="py-3">
        <b>Post an Advert</b>
      </h2>

      {/* copy */}
      <form onSubmit={createAdvertHandler}>
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
                  id="hire"
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
                  id="sale"
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
          <h5 className="py-3">
            <b>Image Gallery</b>
          </h5>

          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />

            {mainImage != "" && (
              <img className="post-image-added" src={mainImage} />
            )}

            <div className="my-auto text-center pt-5">
              <i className="fa fa-picture-o add-icon" aria-hidden="true"></i>
              <br />
              <br />

              <i className="fa fa-plus-circle add-image" aria-hidden="true">
                <p className="flama inline-block">&nbsp;Add Images</p>
              </i>
            </div>
          </div>

          {/* <div className="form-input">
            <div className="image-upload">
              <label htmlFor="file-input1">
                <i className="fa fa-picture-o add-icons" aria-hidden="true"></i>

                <i className="fa fa-plus-circle add-images" aria-hidden="true">
                  <p className="flama inline-block">&nbsp;Add Images</p>
                </i>

                {mainImage != "" && (
                  <img
                    className="added-image"
                    alt="not found"
                    src={mainImage}
                  />
                )}
              </label>

              <input
                className="input-image"
                type="file"
                multiple
                accept="image/*"
                id="file-input1"
                name="file1"
                onChange={(e) => {
                  imageUploadHandler(e);
                }}
              />
            </div>
          </div> */}

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
                    //className="form-select dropdown-btn dropdown-btn-forms pl-3 mt-3"
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {advertCategory != "" ? advertCategory : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {categoriesPickerList.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            setAdvertCategory(e.target.innerText);
                            setAdvertSubCategory("");
                          }}
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Sub Category *</span>
                <div className="select mt-3">
                  <select
                    //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {advertSubCategory != "" ? advertSubCategory : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {subCategoriesPickerList.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setAdvertSubCategory(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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
                    //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {age != "" ? age : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {constantYears.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) => setAge(e.target.innerText)}
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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
                  // defaultChecked
                  name="postAdvertRadio"
                  id="savedAdd"
                  value={postAdvertRadioButtonGroup}
                  onChange={(e) => {
                    setSavedAddress(true);
                    setManualAddress(false);
                    setPostAdvertRadioButtonGroup("savedAddress");
                  }}
                  checked={postAdvertRadioButtonGroup == "savedAddress"}
                />

                <label htmlFor="savedAdd">Saved Address</label>

                <input
                  type="radio"
                  className="ml-5"
                  name="postAdvertRadio"
                  id="manualAdd"
                  value={postAdvertRadioButtonGroup}
                  onChange={(e) => {
                    setSavedAddress(false);
                    setManualAddress(true);
                    setPostAdvertRadioButtonGroup("manualAddress");
                  }}
                  checked={postAdvertRadioButtonGroup == "manualAddress"}
                />

                <label htmlFor="manualAdd">Manual Address</label>
              </div>
            </div>

            {savedAddress && (
              <div className="row pb-3">
                <div className="col-md-6 col-12">
                  <div className="select mt-3">
                    <select
                      //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
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

                    {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {pickedSavedAddress != "" ? pickedSavedAddress : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {addressPickerList.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setPickedSavedAddress(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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
                      //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                      value={pickedManualAddress}
                      onChange={(e) => {
                        setPickedManualAddress(e.target.value);
                      }}
                    >
                      {manualAddressPickerOfPostcode.map((obj, index) => {
                        return (
                          <option key={index} value={obj.value}>
                            {obj.label}
                          </option>
                        );
                      })}
                    </select>

                    {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {pickedSavedAddress != "" ? pickedSavedAddress : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {addressPickerList.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setPickedSavedAddress(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
                  </div>
                </div>
              </div>
            )}

            <div className="row pb-3">
              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Collection Available *</span>
                <div className="select mt-3">
                  <select
                    //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {collectionAvailable != ""
                      ? collectionAvailable
                      : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {YesNo.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setCollectionAvailable(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <span className="span-post-advert">Delivery Available *</span>
                <div className="select mt-3">
                  <select
                    //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {deliveryAvailable != "" ? deliveryAvailable : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {YesNo.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setDeliveryAvailable(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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
                    //className={`btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3`}
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {deliveryDistance != "" ? deliveryDistance : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {Distance.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) =>
                            setDeliveryDistance(e.target.innerText)
                          }
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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

              {/* <div className="col-md-3 col-6">
                <span className="span-post-advert">1 Day *</span>
                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 80"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">2 Day (optional)</span>
                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 81"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">3 Day (optional)</span>
                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 82"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">4 Day (optional)</span>
                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 83"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">5 Day (optional)</span>
                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 84"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">6 Day (optional)</span>
                <input
                  type="itemMake"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 85"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div>
              <div className="col-md-3 col-6">
                <span className="span-post-advert">7 Day (optional)</span>
                <input
                  type="model"
                  className="txtbox mr-3 mt-3"
                  placeholder=" E.g. 86"
                  name="hirePrice"
                  value={hirePrice}
                  onChange={(e) => setHirePrice(e.target.value)}
                />
              </div> */}

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

              <div className="col-md-4 col-12">
                <span className="span-post-advert">Offers accepted *</span>

                <div
                    className={`select mt-3 ${
                      advertiseToSale ? "" : "disabled"
                    }`}>
                  <select
                    disabled={advertiseToSale ? false : true}
                    // className={` ${
                    //   advertiseToSale ? "" : "disabled"
                    // }`}
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

                  {/* <button
                    className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {offersAccepted != "" ? offersAccepted : "—Select—"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    {YesNo.map((obj, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) => setOffersAccepted(e.target.innerText)}
                        >
                          <a href="#">{obj.label}</a>
                        </li>
                      );
                    })}
                  </ul> */}
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
          <p className="pt-2">
            To mark unavailable dates in your calendar for this item, please
            edit the advert once it has been created.
          </p>
          <br />
          <input
            type="checkbox"
            htmlFor="terms"
            defaultValue="read"
            name="checkBox"
            checked={checkBox}
            onChange={(e) => setCheckBox(e.target.checked)}
            required
          />

          {!advertiseToHire && !advertiseToSale ? (
            <label htmlFor="terms">
              {" "}
              I have read and agree to the our{" "}
              <a
                className="a-signup"
                href="https://hirethat.com/hire-terms-conditions/"
                hrefLang="en"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={"_blank"}
              >
                Hire Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a
                className="a-signup"
                href="https://hirethat.com/sale-terms-conditions/"
                hrefLang="en"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={"_blank"}
              >
                Sale Terms &amp; Conditions
              </a>
              .
            </label>
          ) : (
            <label htmlFor="terms">
              {" "}
              I have read and agree to the our{" "}
              {advertiseToHire && (
                <a
                  className="a-signup"
                  href="https://hirethat.com/hire-terms-conditions/"
                  hrefLang="en"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  target={"_blank"}
                >
                  Hire Terms &amp; Conditions
                </a>
              )}
              {advertiseToHire && advertiseToSale && " and "}
              {advertiseToSale && (
                <a
                  className="a-signup"
                  href="https://hirethat.com/sale-terms-conditions/"
                  hrefLang="en"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  target={"_blank"}
                >
                  Sale Terms &amp; Conditions
                </a>
              )}
              .
            </label>
          )}

          <p className="end-words">
            By placing this advert on Hire That you agree to our Terms of
            Conditions of advertising through our app.
          </p>
          <button
            className="btn advert-btn flamabold"
            type="submit"
            value="Submit"
          >
            CREATE ADVERT
          </button>
        </div>
      </form>

      {isPhotoModalVisible && <PhotoModal screen="POSTADVERT" />}
    </div>
  );
};

export { PostAdvert };
