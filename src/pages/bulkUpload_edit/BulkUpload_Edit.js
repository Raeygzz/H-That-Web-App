import React, { useState, useEffect, useCallback, useMemo } from "react";

import Geocode from "react-geocode";
import { toast } from "react-toastify";
import { FaPoundSign } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./BulkUpload_Edit.css";
import { RegExp, getYears } from "../../utils";
import { YesNo, Distance } from "../../constants/Constant";
import { BulkPhotoModal } from "../../shared/pages_common/modal";
import { findAddressFromPostcode } from "../../services/axios/Api";
import { presentLoader, hideLoader } from "../../toolkit/features/LoaderSlice";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { addressListApi } from "../../toolkit/features/AddressSlice";
import { subCategoriesApi } from "../../toolkit/features/CategoriesSlice";
import { manualAddressPostcodePicker } from "../../toolkit/features/AdvertsSlice";
import {
  setSelectedTask,
  showBulkPhotoModal,
  setCsvToAdverts,
  setBulkMainImage,
  BulkPhotosFunction,
  bulkRemoveAll,
  BulkTotalFunction,
  setBulkUploadCreateAdvertList,
} from "../../toolkit/features/BulkUploadSlice";

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

// toast option 3 sec
const Toast3Sec = {
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

// toast option 10 sec
const Toast10Sec = {
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
};

const BulkUpload_Edit = (props) => {
  // const { setSelectedTask } = props;

  const { csvToAdverts } = useSelector((state) => state.bulkUpload);

  const { addressPickerList } = useSelector((state) => state.address);
  const { categoriesPickerList } = useSelector((state) => state.categories);
  const { subCategoriesPickerList } = useSelector((state) => state.categories);
  const { categoriesHirePickerList } = useSelector((state) => state.categories);
  const { categoriesSalePickerList } = useSelector((state) => state.categories);
  const { categoriesForBothPickerList } = useSelector(
    (state) => state.categories
  );

  const { bulkPhotos } = useSelector((state) => state.bulkUpload);
  const { bulkMainImage } = useSelector((state) => state.bulkUpload);
  const { bulkPhotosCount } = useSelector((state) => state.bulkUpload);

  const { isBulkPhotoModalVisible } = useSelector((state) => state.bulkUpload);
  const { manualAddressPickerOfPostcode } = useSelector(
    (state) => state.adverts
  );

  //renderBulkEdit
  const [renderBulkEdit, setRenderBulkEdit] = useState(false);

  // advertIndex
  const [advertIndex, setAdvertIndex] = useState(0);

  // title
  const [advertTitle, setAdvertTitle] = useState("");

  // advertise for hire / sale
  const [advertiseToHire, setAdvertiseToHire] = useState();
  const [advertiseToSale, setAdvertiseToSale] = useState();
  // const [advertiseToHire, setAdvertiseToHire] = useState(false);
  // const [advertiseToSale, setAdvertiseToSale] = useState(false);

  // bulkImages
  const [bulkCount, setBulkCount] = useState("");
  const [bulkImages, setBulkImages] = useState([]);
  const [acceptedFilesCount, setAcceptedFilesCount] = useState("");

  // category
  const [advertCategory, setAdvertCategory] = useState("");

  // sub category
  const [advertSubCategory, setAdvertSubCategory] = useState("");

  // make
  const [make, setMake] = useState("");

  // model
  const [model, setModel] = useState("");

  // description
  const [description, setDescription] = useState("");

  // age / constant years
  const [age, setAge] = useState("");
  const constantYears = useState(getYears())[0];

  // mileage
  const [mileage, setMileage] = useState("");

  // hours used
  const [hoursUsed, setHoursUsed] = useState("");

  // length
  const [length, setLength] = useState("");

  // width
  const [width, setWidth] = useState("");

  // depth
  const [depth, setDepth] = useState("");

  // radio button saved/manual address
  const [postAdvertRadioButtonGroup, setPostAdvertRadioButtonGroup] =
    useState("savedAddress");

  // saved address
  const [savedAddress, setSavedAddress] = useState(true);
  const [pickedSavedAddress, setPickedSavedAddress] = useState("");
  const [savedAddressPostcode, setSavedAddressPostcode] = useState("");

  // manual address
  const [manualAddress, setManualAddress] = useState(false);
  const [typedPostcode, setTypedPostcode] = useState(false);
  const [pickedManualAddress, setPickedManualAddress] = useState("");
  const [manualAddressPostcode, setManualAddressPostcode] = useState("");

  // // latitude / longitude
  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");

  // collection available
  const [collectionAvailable, setCollectionAvailable] = useState("");

  // delivery available
  const [deliveryAvailable, setDeliveryAvailable] = useState("");

  // delivery distance
  const [deliveryDistance, setDeliveryDistance] = useState("");

  // delivery charge
  const [deliveryCharge, setDeliveryCharge] = useState("");

  // hire price
  const [hirePrice1, setHirePrice1] = useState("");
  const [hirePrice2, setHirePrice2] = useState("");
  const [hirePrice3, setHirePrice3] = useState("");
  const [hirePrice4, setHirePrice4] = useState("");
  const [hirePrice5, setHirePrice5] = useState("");
  const [hirePrice6, setHirePrice6] = useState("");
  const [hirePrice7, setHirePrice7] = useState("");

  // hire price validate
  const [perDayPriceValidate, setPerDayPriceValidate] = useState([]);
  const [perDayWiseValidateText, setPerDayWiseValidateText] = useState([]);
  const [hirePriceDayWiseValidate, setHirePriceDayWiseValidate] =
    useState(false);

  // for sale
  const [forSale, setForSale] = useState("");
  const [forSaleValidate, setForSaleValidate] = useState(false);

  // plus vat
  const [plusVAT, setPlusVAT] = useState(false);

  // offers accepted
  const [offersAccepted, setOffersAccepted] = useState("");

  // weight
  const [weight, setWeight] = useState("");

  // product code
  const [productCode, setProductCode] = useState("");

  // ean
  const [ean, setEAN] = useState("");

  // terms & condition checkbox
  const [checkBox, setCheckBox] = useState(false);

  // bulk upload parse enable
  const [bulkUploadParseEnable, setBulkUploadParseEnable] = useState(false);

  // bulk upload parsing advert list
  const [bulkUploadParsingAdvertList, setBulkUploadParsingAdvertList] =
    useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(bulkRemoveAll());
    dispatch(addressListApi());
  }, []);

  useEffect(() => {
    if (csvToAdverts.length > 0) {
      // console.log("csvToAdverts ==> ", csvToAdverts);
      // console.log("advertIndex ==> ", advertIndex);

      setAdvertTitle(
        csvToAdverts[advertIndex].title != null
          ? csvToAdverts[advertIndex].title
          : ""
      );

      setAdvertiseToHire(
        csvToAdverts[advertIndex].is_for_hire === "1" ? true : false
      );

      setAdvertiseToSale(
        csvToAdverts[advertIndex].is_for_sale === "1" ? true : false
      );

      setAdvertCategory(
        csvToAdverts[advertIndex].category_id != null
          ? csvToAdverts[advertIndex].category_id
          : ""
      );

      setAdvertSubCategory(
        csvToAdverts[advertIndex].sub_category_id != null
          ? csvToAdverts[advertIndex].sub_category_id
          : ""
      );

      setMake(
        csvToAdverts[advertIndex].make != null
          ? csvToAdverts[advertIndex].make
          : ""
      );

      setModel(
        csvToAdverts[advertIndex].model != null
          ? csvToAdverts[advertIndex].model
          : ""
      );

      setDescription(
        csvToAdverts[advertIndex].description != null
          ? csvToAdverts[advertIndex].description
          : ""
      );

      setAge(
        csvToAdverts[advertIndex].age != null
          ? csvToAdverts[advertIndex].age.toString()
          : ""
      );

      setMileage(
        csvToAdverts[advertIndex].mileage != null
          ? csvToAdverts[advertIndex].mileage.toString()
          : ""
      );

      setHoursUsed(
        csvToAdverts[advertIndex].hours_used != null
          ? csvToAdverts[advertIndex].hours_used.toString()
          : ""
      );

      setLength(
        csvToAdverts[advertIndex].length_mm != null
          ? csvToAdverts[advertIndex].length_mm.toString()
          : ""
      );

      setWidth(
        csvToAdverts[advertIndex].width_mm != null
          ? csvToAdverts[advertIndex].width_mm.toString()
          : ""
      );

      setDepth(
        csvToAdverts[advertIndex].height_mm != null
          ? csvToAdverts[advertIndex].height_mm.toString()
          : ""
      );

      if (csvToAdverts[advertIndex].is_manual_address === undefined) {
        setSavedAddress(true);
        setManualAddress(false);
        setSavedAddressPostcode("");
        setPickedSavedAddress("");
        setManualAddressPostcode("");
        setPickedManualAddress("");
        setPostAdvertRadioButtonGroup("savedAddress");
        changeOnCsvToAdvertArray("is_manual_address", "0", "resetLocation");
      }

      if (csvToAdverts[advertIndex].is_manual_address === "1") {
        findAddressFromPostcode(csvToAdverts[advertIndex].post_code)
          .then((res) => {
            if (res?.status === 200) {
              // setLatitude(res.data.latitude);
              // setLongitude(res.data.longitude);

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

        setSavedAddress(false);
        setManualAddress(true);
        setManualAddressPostcode(csvToAdverts[advertIndex].post_code);
        setPickedManualAddress(csvToAdverts[advertIndex].location);
        setPostAdvertRadioButtonGroup("manualAddress");
      }

      if (csvToAdverts[advertIndex].is_manual_address === "0") {
        setSavedAddress(true);
        setManualAddress(false);
        setSavedAddressPostcode(csvToAdverts[advertIndex].post_code);
        setPickedSavedAddress(csvToAdverts[advertIndex].location);
        setPostAdvertRadioButtonGroup("savedAddress");

        // addressPickerList.filter((obj) => {
        //   if (obj.label === csvToAdverts[advertIndex].location) {
        //     setLatitude(obj.lat);
        //     setLongitude(obj.lon);
        //   }
        // });
      }

      setCollectionAvailable(
        csvToAdverts[advertIndex].is_for_collection != null
          ? csvToAdverts[advertIndex].is_for_collection
          : ""
      );

      setDeliveryAvailable(
        csvToAdverts[advertIndex].is_for_delivery != null
          ? csvToAdverts[advertIndex].is_for_delivery
          : ""
      );

      setDeliveryDistance(
        csvToAdverts[advertIndex].delivery_distance != null
          ? csvToAdverts[advertIndex].delivery_distance.toString()
          : "Unlimited"
      );

      setDeliveryCharge(
        csvToAdverts[advertIndex].delivery_charge_mile != null
          ? csvToAdverts[advertIndex].delivery_charge_mile.toString()
          : ""
      );

      setHirePrice1(
        csvToAdverts[advertIndex].price_day_1 != null
          ? csvToAdverts[advertIndex].price_day_1.toString()
          : ""
      );
      setHirePrice2(
        csvToAdverts[advertIndex].price_day_2 != null
          ? csvToAdverts[advertIndex].price_day_2.toString()
          : ""
      );
      setHirePrice3(
        csvToAdverts[advertIndex].price_day_3 != null
          ? csvToAdverts[advertIndex].price_day_3.toString()
          : ""
      );
      setHirePrice4(
        csvToAdverts[advertIndex].price_day_4 != null
          ? csvToAdverts[advertIndex].price_day_4.toString()
          : ""
      );
      setHirePrice5(
        csvToAdverts[advertIndex].price_day_5 != null
          ? csvToAdverts[advertIndex].price_day_5.toString()
          : ""
      );
      setHirePrice6(
        csvToAdverts[advertIndex].price_day_6 != null
          ? csvToAdverts[advertIndex].price_day_6.toString()
          : ""
      );
      setHirePrice7(
        csvToAdverts[advertIndex].price_day_7 != null
          ? csvToAdverts[advertIndex].price_day_7.toString()
          : ""
      );

      setForSale(
        csvToAdverts[advertIndex].selling_price != null
          ? csvToAdverts[advertIndex].selling_price.toString()
          : ""
      );

      let plusVATCheckBoxSelected =
        csvToAdverts[advertIndex].vat != null
          ? csvToAdverts[advertIndex].vat === "1"
            ? true
            : false
          : false;
      setPlusVAT(plusVATCheckBoxSelected);

      setOffersAccepted(
        csvToAdverts[advertIndex].offers_accepted != null
          ? csvToAdverts[advertIndex].offers_accepted
          : ""
      );

      setWeight(
        csvToAdverts[advertIndex]?.weight != null
          ? csvToAdverts[advertIndex].weight.toString()
          : ""
      );

      setProductCode(
        csvToAdverts[advertIndex]?.product_code != null
          ? csvToAdverts[advertIndex]?.product_code
          : ""
      );

      setEAN(
        csvToAdverts[advertIndex]?.ean != null
          ? csvToAdverts[advertIndex].ean.toString()
          : ""
      );

      setCheckBox(true);
      // setRenderBulkEdit(true);
    }
  }, [csvToAdverts, advertIndex, addressPickerList]);

  // set render for BulkEdit
  useEffect(() => {
    if (
      (!advertiseToHire && !advertiseToSale) ||
      (advertiseToHire && advertiseToSale) ||
      (advertiseToHire && !advertiseToSale) ||
      (!advertiseToHire && advertiseToSale)
    ) {
      setRenderBulkEdit(true);
    }
  }, [advertiseToHire, advertiseToSale]);

  useEffect(() => {
    if (bulkUploadParseEnable && bulkUploadParsingAdvertList.length > 0) {
      dispatch(setBulkUploadCreateAdvertList(bulkUploadParsingAdvertList));

      dispatch(setSelectedTask("parse"));
    }
  }, [bulkUploadParseEnable, bulkUploadParsingAdvertList]);

  // advertItemNumberHandler
  const advertItemNumberHandler = (option) => {
    if (option === "minus" && advertIndex != 0) {
      setAdvertIndex(advertIndex - 1);
    }

    if (option === "plus" && advertIndex < csvToAdverts.length - 1) {
      setAdvertIndex(advertIndex + 1);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      // console.log("advertIndex ==> ", advertIndex);
      // console.log("acceptedFiles ==> ", acceptedFiles);
      // console.log("bulkPhotosCount ==> ", bulkPhotosCount);
      // console.log("acceptedFiles.length ==> ", acceptedFiles.length);
      // console.log("bulkPhotosCount[advertIndex]?.bulkPhotosCount ==> ",  bulkPhotosCount[advertIndex]?.bulkPhotosCount
      // );

      let particularBulkPhotosCount =
        bulkPhotosCount.length > 0
          ? bulkPhotosCount.find((ele) => {
              return ele.advertIndex === advertIndex;
            })
          : undefined;
      // console.log("particularBulkPhotosCount ==> ", particularBulkPhotosCount);

      let count =
        particularBulkPhotosCount !== undefined
          ? particularBulkPhotosCount.bulkPhotosCount + acceptedFiles.length
          : acceptedFiles.length;

      // console.log("count ==> ", count);
      // console.log("advertIndex ==> ", advertIndex);

      setBulkImages([]);
      setBulkCount(count);
      setAcceptedFilesCount(acceptedFiles.length);

      // csvToAdverts.filter((obj, index) => {
      //   if (advertIndex === index) {
      if (count > 5) {
        toast("Only five photos are allowed to add in gallery.", Toast3Sec);

        return;
      }
      //   }
      // });

      if (count > 0 && count < 6) {
        // csvToAdverts.filter((obj, index) => {
        // if (advertIndex === index) {
        for (let i = 0; i < acceptedFiles.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(acceptedFiles[i]);

          reader.onload = function () {
            if (count === 1) {
              dispatch(
                setBulkMainImage({
                  advertIndex: advertIndex,
                  bulkMainImage: reader.result,
                })
              );

              setBulkImages((prevArray) => [...prevArray, reader.result]);

              return;
            }

            setBulkImages((prevArray) => [...prevArray, reader.result]);
          };

          reader.onerror = function (error) {
            console.log("Error ==> ", error);
          };
        }
        // }
        // });

        dispatch(
          BulkTotalFunction({
            advertIndex: advertIndex,
            bulkPhotosCount: count,
            bulkTotal: bulkPhotosCount,
          })
        );
      }
    },
    [advertIndex, bulkPhotosCount]
  );

  // console.log("bulkImages ==> ", bulkImages);
  // console.log("acceptedFilesCount ==> ", acceptedFilesCount);
  useEffect(() => {
    if (acceptedFilesCount != "" && bulkImages.length > 0) {
      if (acceptedFilesCount === bulkImages.length) {
        dispatch(
          BulkPhotosFunction({
            advertIndex: advertIndex,
            bulkImages: bulkImages,
            bulkPhotos: bulkPhotos,
          })
        );

        if (bulkCount > 1) {
          dispatch(showBulkPhotoModal(true));
        }
      }
    }
  }, [acceptedFilesCount, bulkCount, bulkImages]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, multiple: true, accept: "image/*" });

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

  // toast message while advertiseToSale is true
  useEffect(() => {
    if (advertiseToSale) {
      toast(
        "Card details will be requested, However, listing an item for sale is completely free and no charge will be applied to your card at this time. You will be notified of any changes in advance.",
        Toast10Sec
      );
    }
  }, [advertiseToSale]);

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
          // setLatitude(item.lat);
          // setLongitude(item.lon);

          changeOnCsvToAdvertArray("location", val, "", {
            post_code: item.postcode,
            lat: item.lat,
            lon: item.lon,
          });
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
        // changeOnCsvToAdvertArray("post_code", manualAddressPostcode);

        findAddressFromPostcode(manualAddressPostcode)
          .then((res) => {
            if (res?.status === 200) {
              // setLatitude(res.data.latitude);
              // setLongitude(res.data.longitude);
              changeOnCsvToAdvertArray("post_code", manualAddressPostcode, "", {
                post_code: manualAddressPostcode,
                lat: res.data.latitude,
                lon: res.data.longitude,
              });

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
    // setLatitude(latitude);
    // setLongitude(longitude);

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
              // changeOnCsvToAdvertArray("post_code", obj.long_name);
              changeOnCsvToAdvertArray("post_code", obj.long_name, "", {
                post_code: obj.long_name,
                lat: latitude,
                lon: longitude,
              });
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

    let validationPickup = "";

    // advert title validation
    csvToAdverts.filter((obj, index) => {
      if (obj.title === "") {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please enter Title field in ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // advertise for hire / sale validation
    csvToAdverts.filter((obj, index) => {
      if (
        (obj.is_for_hire === undefined && obj.is_for_sale === undefined) ||
        (obj.is_for_hire === "" && obj.is_for_sale === "") ||
        (obj.is_for_hire === "0" && obj.is_for_sale === "0")
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please check atleast anyone of advertise for hire or advertise for sale on ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // main image validation
    let addChar = "";
    let particularBulkMainImage = "";
    csvToAdverts.filter((obj, index) => {
      particularBulkMainImage =
        bulkMainImage.length > 0
          ? bulkMainImage.find((ele) => {
              return ele.advertIndex === index;
            })
          : undefined;

      if (particularBulkMainImage?.bulkMainImage === undefined) {
        addChar = addChar + " " + (index + 1);
      }
    });

    if (addChar != "") {
      toast(
        `Please upload atleast one image on these ${addChar} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // category validation
    csvToAdverts.filter((obj, index) => {
      if (obj.category_id === "" || obj.category_id === undefined) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please select advert category for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // sub category validation
    csvToAdverts.filter((obj, index) => {
      if (obj.sub_category_id === "" || obj.sub_category_id === undefined) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please select advert sub category for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // make validation
    csvToAdverts.filter((obj, index) => {
      if (obj.make === "" || obj.make === undefined) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please enter Make field for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // model validation
    csvToAdverts.filter((obj, index) => {
      if (obj.model === "" || obj.model === undefined) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please enter Model field for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // saved address location validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_manual_address === "0" &&
        (obj.location === "" || obj.location === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please update location on ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // address of manualAddress validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_manual_address === "1" &&
        (obj.location === "" || obj.location === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please update address on ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // latitude / longitude validation
    csvToAdverts.filter((obj, index) => {
      if (
        (obj.latitude === "" && obj.longitude === "") ||
        (obj.latitude === undefined && obj.longitude === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `Please update location on ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // collection / delivery available validation
    csvToAdverts.filter((obj, index) => {
      if (
        (obj.is_for_collection === undefined &&
          obj.is_for_delivery === undefined) ||
        (obj.is_for_collection === "0" && obj.is_for_delivery === "0")
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `You cannot disable both delivery and collection available for ${validationPickup} number adverts. Please enable any one of them.`,
        Toast3Sec
      );

      return;
    }

    // delivery charge validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_for_delivery === "1" &&
        (obj.delivery_charge_mile === "" ||
          obj.delivery_charge_mile === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `please enter Delivery Charge Per Mile for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // delivery charge mile number validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_for_delivery === "1" &&
        !/^(0|[1-9]\d*)(\.\d+)?$/.test(obj.delivery_charge_mile)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `please enter valid Delivery Charge Per Mile for ${validationPickup} number adverts.`,
        Toast3Sec
      );

      return;
    }

    // hire price validation
    let values;
    let notValidAdvertsNumber = "";
    let invalidHirePriceOnAdvert = "";

    setPerDayPriceValidate([]);

    let onlyHirePriceFromCsvToAdverts = csvToAdverts.map((obj, index) => {
      return {
        is_for_hire: obj.is_for_hire,
        price_day_1: obj.price_day_1,
        price_day_2: obj.price_day_2,
        price_day_3: obj.price_day_3,
        price_day_4: obj.price_day_4,
        price_day_5: obj.price_day_5,
        price_day_6: obj.price_day_6,
        price_day_7: obj.price_day_7,
      };
    });

    // console.log("onlyHirePriceFromCsvToAdverts ==> ", onlyHirePriceFromCsvToAdverts);

    for (let i = 0; i < onlyHirePriceFromCsvToAdverts.length; i++) {
      if (onlyHirePriceFromCsvToAdverts[i].is_for_hire === "1") {
        // console.log(
        //   "onlyHirePriceFromCsvToAdverts[i] ==> ",
        //   onlyHirePriceFromCsvToAdverts[i]
        // );

        let finalObj = { ...onlyHirePriceFromCsvToAdverts[i] };
        delete finalObj["is_for_hire"];
        // console.log("finalObj ==> ", finalObj);

        let allEmpty = Object.keys(finalObj).every(function (key) {
          return finalObj[key].length === 0;
        });

        // console.log("allEmpty ==> ", allEmpty);

        if (allEmpty) {
          toast(
            `At least one day rate must be entered on advert number ${i + 1}.`,
            Toast3Sec
          );

          setPerDayPriceValidate((prevArray) => [
            ...prevArray,
            {
              advertIndex: i,
              validationMessage: `At least one day rate must be entered on advert number ${
                i + 1
              }.`,
            },
          ]);

          return;
        }
      }
    }

    for (let i = 0; i < onlyHirePriceFromCsvToAdverts.length; i++) {
      if (onlyHirePriceFromCsvToAdverts[i].is_for_hire === "1") {
        Object.entries(onlyHirePriceFromCsvToAdverts[i]).forEach(
          ([key, value]) => {
            if (value != "" && !RegExp.DigitAndDecimalsOnly.test(value)) {
              invalidHirePriceOnAdvert =
                invalidHirePriceOnAdvert + " " + (i + 1);

              // console.log("invalidHirePriceOnAdvert ==> ", invalidHirePriceOnAdvert);

              setPerDayPriceValidate((prevArray) => [
                ...prevArray,
                {
                  advertIndex: i,
                  validationMessage: `Hire Price can only be a number or a decimal value. Please check Hire Price detail on advert number ${invalidHirePriceOnAdvert}`,
                },
              ]);
            }
          }
        );
      }
    }

    if (invalidHirePriceOnAdvert != "") {
      return;
    }

    onlyHirePriceFromCsvToAdverts.filter((obj, index) => {
      if (obj.is_for_hire === "1") {
        // console.log("obj ==> ", obj);

        let finalObj = { ...obj };
        delete finalObj["is_for_hire"];
        // console.log("finalObj ==> ", finalObj);

        values = Object.entries(finalObj).map((e) => ({
          [e[0]]: e[1],
        }));
        // console.log("values ==> ", values);

        for (let i = values.length - 1; i >= 0; i--) {
          for (let j = i - 1; j >= 0; j--) {
            // console.log("i ==> ", parseFloat(values[i][`price_day_${i + 1}`]));
            // console.log("j ==> ", parseFloat(values[j][`price_day_${j + 1}`]));

            if (
              parseFloat(values[i][`price_day_${i + 1}`]) <
              parseFloat(values[j][`price_day_${j + 1}`])
            ) {
              // console.log("i, j ==> ", i, j);

              notValidAdvertsNumber = notValidAdvertsNumber + " " + (index + 1);

              // console.log("notValidAdvertsNumber ==> ", notValidAdvertsNumber);

              setPerDayWiseValidateText((prevArray) => [
                ...prevArray,
                {
                  advertIndex: index,
                  validationMessage: `hire_price associated to day ${
                    i + 1
                  } must be greater than hire_price associated to day ${
                    j + 1
                  } in ${index + 1} number adverts.`,
                },
              ]);
            }
          }
        }
      }
    });

    if (notValidAdvertsNumber != "") {
      toast(
        `Please check the Hire Price details on ${notValidAdvertsNumber} adverts.`,
        Toast3Sec
      );

      return;
    }

    // sale price validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_for_sale === "1" &&
        (obj.selling_price === "" || obj.selling_price === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `please enter Sale Price for ${validationPickup} adverts.`,
        Toast3Sec
      );

      return;
    }

    // sale price number validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_for_sale === "1" &&
        !/^(0|[1-9]\d*)(\.\d+)?$/.test(obj.selling_price)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `please enter valid Sale Price for ${validationPickup} adverts.`,
        Toast3Sec
      );

      return;
    }

    // offers accepted validation
    csvToAdverts.filter((obj, index) => {
      if (
        obj.is_for_sale === "1" &&
        (obj.offers_accepted === "" || obj.offers_accepted === undefined)
      ) {
        validationPickup = validationPickup + " " + (index + 1);
      }
    });

    if (validationPickup != "") {
      toast(
        `please select offers accepted for ${validationPickup} adverts.`,
        Toast3Sec
      );

      return;
    }

    for (let i = 0; i < csvToAdverts.length; i++) {
      // particularBulkPhotos
      let particularBulkPhotos =
        bulkPhotos.length > 0
          ? bulkPhotos.find((ele) => {
              return ele.advertIndex === i;
            })
          : undefined;

      // particularBulkMainImage
      let particularBulkMainImage =
        bulkMainImage.length > 0
          ? bulkMainImage.find((ele) => {
              return ele.advertIndex === i;
            })
          : undefined;

      let obj = {
        navigate: navigate,
        from: "BulkUpload",
        advertIndex: i + 1,
        name: csvToAdverts[i].title,
        is_for_hire: csvToAdverts[i].is_for_hire,
        is_for_sale: csvToAdverts[i].is_for_sale,
        photos: particularBulkPhotos.bulkPhotos,
        main_image: particularBulkMainImage.bulkMainImage,
        category_id: csvToAdverts[i].category_id,
        sub_category_id: csvToAdverts[i].sub_category_id,
        make: csvToAdverts[i].make,
        model: csvToAdverts[i].model,
        description: csvToAdverts[i].description,
        age: csvToAdverts[i].age != "" ? parseInt(csvToAdverts[i].age) : "",
        mileage: csvToAdverts[i].mileage,
        hours_used: csvToAdverts[i].hours_used,
        length_mm: csvToAdverts[i].length_mm,
        width_mm: csvToAdverts[i].width_mm,
        height_mm: csvToAdverts[i].height_mm,
        is_manual_address: csvToAdverts[i].is_manual_address,
        location: csvToAdverts[i].location,
        post_code: csvToAdverts[i].post_code,
        latitude: csvToAdverts[i].latitude,
        longitude: csvToAdverts[i].longitude,
        is_for_collection: csvToAdverts[i].is_for_collection,
        is_for_delivery: csvToAdverts[i].is_for_delivery,
        delivery_distance:
          csvToAdverts[i].delivery_distance !== ""
            ? csvToAdverts[i].delivery_distance
            : null,
        delivery_charge_mile:
          csvToAdverts[i].is_for_delivery === "0"
            ? null
            : csvToAdverts[i].delivery_charge_mile,
        price_day_1:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_1
            : "",
        price_day_2:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_2
            : "",
        price_day_3:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_3
            : "",
        price_day_4:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_4
            : "",
        price_day_5:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_5
            : "",
        price_day_6:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_6
            : "",
        price_day_7:
          csvToAdverts[i].is_for_hire === "1"
            ? csvToAdverts[i].price_day_7
            : "",
        weight: csvToAdverts[i].weight,
        product_code: csvToAdverts[i].product_code,
        ean: csvToAdverts[i].ean,
        vat:
          csvToAdverts[i].is_for_sale === "1"
            ? csvToAdverts[i].vat === "1"
              ? "1"
              : "0"
            : "0",
        selling_price:
          csvToAdverts[i].is_for_sale === "1"
            ? csvToAdverts[i].selling_price
            : null,
        offers_accepted:
          csvToAdverts[i].is_for_sale === "1"
            ? csvToAdverts[i].offers_accepted
            : "0",
        accepted_terms_and_conditions: "1",
      };

      // console.log("post-advert-obj --> ", obj);
      setBulkUploadParsingAdvertList((prevArray) => [...prevArray, obj]);
    }

    setBulkUploadParseEnable(true);
  };

  // changeOnCsvToAdvertArray
  const changeOnCsvToAdvertArray = (key, targetValue, reset = "", obj = "") => {
    // console.log("changeOnCsvToAdvertArray ==> ", key, targetValue, reset, obj);

    const newArr = csvToAdverts.map((obj, index) => {
      if (index === advertIndex) {
        return { ...obj, [key]: targetValue };
      }

      return obj;
    });

    if (reset === "resetHirePrice") {
      newArr[advertIndex].hire_price_1 = "";
      newArr[advertIndex].hire_price_2 = "";
      newArr[advertIndex].hire_price_3 = "";
      newArr[advertIndex].hire_price_4 = "";
      newArr[advertIndex].hire_price_5 = "";
      newArr[advertIndex].hire_price_6 = "";
      newArr[advertIndex].hire_price_7 = "";
    }

    if (reset === "resetForSale") {
      newArr[advertIndex].selling_price = "";
      newArr[advertIndex].offers_accepted = "";
    }

    if (reset === "resetSubCategory") {
      newArr[advertIndex].sub_category_id = "";
    }

    if (reset === "resetLocation") {
      newArr[advertIndex].location = "";
    }

    if (reset === "resetDelivery" && targetValue === "0") {
      newArr[advertIndex].delivery_distance = "";
      newArr[advertIndex].delivery_charge_mile = "";
    }

    if (obj != "") {
      newArr[advertIndex].post_code = obj.post_code;
      newArr[advertIndex].latitude = obj.lat;
      newArr[advertIndex].longitude = obj.lon;
    }

    console.log("newArr ==> ", newArr);
    dispatch(setCsvToAdverts(newArr));
  };

  // main image to display in image gallery
  let displayImageOnImageGallery =
    bulkMainImage.length > 0
      ? bulkMainImage.map((obj, index) => {
          if (obj.advertIndex === advertIndex) {
            return (
              <img
                key={index}
                className="post-image-added"
                src={obj.bulkMainImage}
              />
            );
          }
        })
      : null;

  // console.log("advertIndex ==> ", advertIndex);
  // console.log("perDayPriceValidate ==> ", perDayPriceValidate);
  // console.log("perDayWiseValidateText ==> ", perDayWiseValidateText);
  return renderBulkEdit ? (
    <div>
      <b className="orange-no-pointer">Step 3 of 5</b>

      <h2 className="title-bulk-card mt-3">
        <b>Edit Your Items</b>
      </h2>

      <p className="spacing-bulk">
        Now that your items have been imported with the configuration settings
        you selected, you can edit each of your items before they are finalised
      </p>

      <div className="bulk-edit-top">
        <div className="row">
          <div className="col-lg-2 col-3 text-center">
            <button
              className="bulk-edit-top-btn"
              onClick={advertItemNumberHandler.bind(this, "minus")}
            >
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </button>
          </div>

          <div className="col-lg-8 col-6 text-center">
            <p className="bulk-edit-top-p">
              Item {advertIndex + 1} of {csvToAdverts.length}
            </p>
          </div>

          <div className="col-lg-2 col-3 text-center">
            <button
              className="bulk-edit-top-btn"
              onClick={advertItemNumberHandler.bind(this, "plus")}
            >
              <i className="fa fa-chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={createAdvertHandler}>
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
                  onChange={(e) => {
                    setAdvertTitle(e.target.value);
                    changeOnCsvToAdvertArray("title", e.target.value);
                  }}
                  required
                />
              </div>

              <div className="col-lg-3 col-6">
                <br />

                <input
                  type="checkbox"
                  id="hire"
                  name="advertiseToHire"
                  checked={advertiseToHire}
                  onChange={(e) => {
                    setAdvertiseToHire(e.target.checked);
                    changeOnCsvToAdvertArray(
                      "is_for_hire",
                      e.target.checked === true ? "1" : "0",
                      "resetHirePrice"
                    );

                    if (!e.target.checked) {
                      setHirePriceDayWiseValidate(true);
                    }

                    if (e.target.checked) {
                      setHirePriceDayWiseValidate(false);
                    }

                    setHirePrice1("");
                    setHirePrice2("");
                    setHirePrice3("");
                    setHirePrice4("");
                    setHirePrice5("");
                    setHirePrice6("");
                    setHirePrice7("");
                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />

                <label htmlFor="hire"> Advertise for hire *</label>
              </div>

              <div className="col-lg-3 col-6">
                <br />

                <input
                  type="checkbox"
                  id="sale"
                  name="advertiseToSale"
                  checked={advertiseToSale}
                  onChange={(e) => {
                    setAdvertiseToSale(e.target.checked);
                    changeOnCsvToAdvertArray(
                      "is_for_sale",
                      e.target.checked === true ? "1" : "0",
                      "resetForSale"
                    );
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

          <div className="form-input">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />

              {displayImageOnImageGallery}

              <div className="my-auto text-center pt-5">
                {bulkMainImage[advertIndex]?.bulkMainImage?.length ===
                undefined ? (
                  <p
                    style={{
                      fontSize: 64,
                      fontWeight: 900,
                      color: "grey",
                    }}
                  >
                    {advertTitle}
                  </p>
                ) : (
                  <>
                    <i
                      className="fa fa-picture-o add-icon"
                      aria-hidden="true"
                    ></i>

                    <br />
                    <br />
                  </>
                )}

                <i className="fa fa-plus-circle add-image" aria-hidden="true">
                  <p className="flama inline-block">&nbsp;Add Images</p>
                </i>
              </div>
            </div>
          </div>

          <hr className="mt-4 mb-2" />

          {/* Item Details */}
          <h5 className="py-3">
            <b>Item Details</b>
          </h5>

          <div className="container-fluid">
            <div className="row pb-3">
              <div className="col-md-6 col-12">
                <span>Advert Category *</span>

                {/* delete console after test pass */}
                {console.log("advertiseToHire ==> ", advertiseToHire)}
                {console.log("advertiseToSale ==> ", advertiseToSale)}
                {/* {console.log("advertiseToHire ==> ", advertiseToHire)}
                {console.log("advertiseToSale ==> ", advertiseToSale)}
                {console.log("categoriesPickerList ==> ", categoriesPickerList)}
                {console.log("categoriesHirePickerList ==> ", categoriesHirePickerList)}
                {console.log("categoriesSalePickerList ==> ", categoriesSalePickerList)}
                {console.log("categoriesForBothPickerList ==> ", categoriesForBothPickerList)} */}

                <div className="select my-3">
                  <select
                    // className="form-select dropdown-btn dropdown-btn-forms pl-3 mt-3"
                    value={advertCategory}
                    onChange={(e) => {
                      e.preventDefault();
                      setAdvertCategory(e.target.value);
                      changeOnCsvToAdvertArray(
                        "category_id",
                        e.target.value,
                        "resetSubCategory"
                      );
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

              <div className="col-md-6 col-12">
                <span>Sub Category *</span>

                <div className="select my-3">
                  <select
                    // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    value={advertSubCategory}
                    onChange={(e) => {
                      setAdvertSubCategory(e.target.value);
                      changeOnCsvToAdvertArray(
                        "sub_category_id",
                        e.target.value
                      );
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

              <div className="col-md-6 col-12">
                <span>Make *</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g JCB"
                  name="make"
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    changeOnCsvToAdvertArray("make", e.target.value);
                  }}
                  required
                />
              </div>

              <div className="col-md-6 col-12">
                <span>Model *</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 8008 CTS"
                  name="model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    changeOnCsvToAdvertArray("model", e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="row pb-3">
              <div className="col-12">
                <span>Description (optional)</span>

                <textarea
                  type="text"
                  className="txtbox txtarea mr-3 mt-3"
                  placeholder="Describe the condition and key features of your item"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    changeOnCsvToAdvertArray("description", e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row pb-3">
              <div className="col-md-6 col-12">
                <span>Age (YOM) (optional)</span>

                <div className="select mt-3">
                  <select
                    // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      changeOnCsvToAdvertArray("age", e.target.value);
                    }}
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

              <div className="col-md-6 col-12">
                <span>Mileage (optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 9500"
                  name="mileage"
                  value={mileage}
                  onChange={(e) => {
                    setMileage(e.target.value);
                    changeOnCsvToAdvertArray("mileage", e.target.value);
                  }}
                />
              </div>

              <div className="col-md-6 col-12">
                <span>Hours Used (optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 300"
                  name="hoursUsed"
                  value={hoursUsed}
                  onChange={(e) => {
                    setHoursUsed(e.target.value);
                    changeOnCsvToAdvertArray("hours_used", e.target.value);
                  }}
                />
              </div>

              <div className="col-md-6 col-12">
                <span>Dimensions (in CM) (optional)</span>

                <div className="container">
                  <div className="row">
                    <div className="col-4 pl-0">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="L"
                        name="length"
                        value={length}
                        onChange={(e) => {
                          setLength(e.target.value);
                          changeOnCsvToAdvertArray("length_mm", e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-4 px-2">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="W"
                        name="width"
                        value={width}
                        onChange={(e) => {
                          setWidth(e.target.value);
                          changeOnCsvToAdvertArray("width_mm", e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-4 pr-0">
                      <input
                        type="text"
                        className="txtbox mr-3 mt-3"
                        placeholder="D"
                        name="depth"
                        value={depth}
                        onChange={(e) => {
                          setDepth(e.target.value);
                          changeOnCsvToAdvertArray("height_mm", e.target.value);
                        }}
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
                <span>Item Location *</span>
                <br />
                <br />

                <input
                  type="radio"
                  name="postAdvertRadio"
                  id="savedAdd"
                  value={postAdvertRadioButtonGroup}
                  onChange={(e) => {
                    setSavedAddress(true);
                    setManualAddress(false);
                    setPostAdvertRadioButtonGroup("savedAddress");
                    changeOnCsvToAdvertArray(
                      "is_manual_address",
                      "0",
                      "resetLocation"
                    );
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
                    changeOnCsvToAdvertArray(
                      "is_manual_address",
                      "1",
                      "resetLocation"
                    );
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
                      // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                      value={pickedSavedAddress}
                      onChange={(e) => {
                        setPickedSavedAddress(e.target.value);
                        savedAddressPostcodeHandler(e.target.value);
                        // changeOnCsvToAdvertArray("location", e.target.value);
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
                      // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                      value={pickedManualAddress}
                      onChange={(e) => {
                        setPickedManualAddress(e.target.value);
                        changeOnCsvToAdvertArray("location", e.target.value);
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
              <div className="col-md-6 col-12">
                <span>Collection Available *</span>

                <div className="select mt-3">
                  <select
                    // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    value={collectionAvailable}
                    onChange={(e) => {
                      setCollectionAvailable(e.target.value);
                      changeOnCsvToAdvertArray(
                        "is_for_collection",
                        e.target.value
                      );
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

              <div className="col-md-6 col-12">
                <span>Delivery Available *</span>

                <div className="select mt-3">
                  <select
                    // className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3"
                    value={deliveryAvailable}
                    onChange={(e) => {
                      setDeliveryAvailable(e.target.value);
                      changeOnCsvToAdvertArray(
                        "is_for_delivery",
                        e.target.value,
                        "resetDelivery"
                      );

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

              <div className="col-md-6 col-12">
                <span>Delivery Distance *</span>

                <div className={`select mt-3 ${
                      deliveryAvailable === "0" ? "disabled" : ""
                    }`}>
                  <select
                    disabled={deliveryAvailable === "0" ? true : false}
                    // className={`btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3 
                    value={deliveryDistance}
                    onChange={(e) => {
                      setDeliveryDistance(e.target.value);
                      changeOnCsvToAdvertArray(
                        "delivery_distance",
                        e.target.value
                      );
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

              <div className="col-md-6 col-12">
                <span>Delivery Charge (per mile) *</span>

                <input
                  type="text"
                  disabled={deliveryAvailable === "0" ? true : false}
                  className={`txtbox mr-3 mt-3 ${
                    deliveryAvailable === "0" ? "disabled" : ""
                  }`}
                  placeholder=" E.g 2.50"
                  name="deliveryCharge"
                  value={deliveryCharge}
                  onChange={(e) => {
                    setDeliveryCharge(e.target.value);
                    changeOnCsvToAdvertArray(
                      "delivery_charge_mile",
                      e.target.value
                    );
                  }}
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
              <div className="col-md-3 col-6">
                <span className="span-post-advert">1 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 80"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice1"
                  value={hirePrice1}
                  onChange={(e) => {
                    setHirePrice1(e.target.value);
                    changeOnCsvToAdvertArray("price_day_1", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">2 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 81"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice2"
                  value={hirePrice2}
                  onChange={(e) => {
                    setHirePrice2(e.target.value);
                    changeOnCsvToAdvertArray("price_day_2", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">3 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 82"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice3"
                  value={hirePrice3}
                  onChange={(e) => {
                    setHirePrice3(e.target.value);
                    changeOnCsvToAdvertArray("price_day_3", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">4 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 83"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice4"
                  value={hirePrice4}
                  onChange={(e) => {
                    setHirePrice4(e.target.value);
                    changeOnCsvToAdvertArray("price_day_4", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">5 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 84"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice5"
                  value={hirePrice5}
                  onChange={(e) => {
                    setHirePrice5(e.target.value);
                    changeOnCsvToAdvertArray("price_day_5", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">6 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 85"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice6"
                  value={hirePrice6}
                  onChange={(e) => {
                    setHirePrice6(e.target.value);
                    changeOnCsvToAdvertArray("price_day_6", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              <div className="col-md-3 col-6">
                <span className="span-post-advert">7 Day (optional)</span>

                <FaPoundSign className="pound-icon-pa" />

                <input
                  disabled={advertiseToHire ? false : true}
                  type="text"
                  className={`txtbox mr-3 pl-5 mt-3 ${
                    advertiseToHire ? "" : "disabled"
                  }`}
                  placeholder="E.g 86"
                  readOnly={hirePriceDayWiseValidate ? true : false}
                  name="hirePrice7"
                  value={hirePrice7}
                  onChange={(e) => {
                    setHirePrice7(e.target.value);
                    changeOnCsvToAdvertArray("price_day_7", e.target.value);

                    setPerDayPriceValidate([]);
                    setPerDayWiseValidateText([]);
                  }}
                />
              </div>

              {perDayWiseValidateText.length > 0 &&
                perDayWiseValidateText.map((obj, index) => (
                  <p key={index} style={{ color: "red" }}>
                    {obj.validationMessage}
                  </p>
                ))}
            </div>

            {perDayPriceValidate.length > 0 &&
              perDayPriceValidate.map((obj, index) => (
                <p key={index} style={{ color: "red" }}>
                  {obj.validationMessage}
                </p>
              ))}
          </div>

          <hr />

          {/* Selling Price */}
          <h5 className="py-3">
            <b>Selling Price</b>
          </h5>

          <div className="container-fluid">
            <div className="row pb-3">
              <div className="col-md-4 col-12">
                <span>For sale price *</span>

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
                    changeOnCsvToAdvertArray("selling_price", e.target.value);
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
                    onChange={(e) => {
                      setPlusVAT(e.target.checked);
                      changeOnCsvToAdvertArray(
                        "vat",
                        e.target.checked ? "1" : "0"
                      );
                    }}
                  />
                  <label htmlFor="Plus Vat">Plus VAT</label>
                </div>
              )}

              <div className="col-md-3 col-12">
                <span>Offers accepted *</span>

                <div className={`select mt-3 ${
                      advertiseToSale ? "" : "disabled"
                    }`}>
                  <select
                    disabled={advertiseToSale ? false : true}
                    // className={`btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-forms mt-3
                    value={offersAccepted}
                    onChange={(e) => {
                      setOffersAccepted(e.target.value);
                      changeOnCsvToAdvertArray(
                        "offers_accepted",
                        e.target.value
                      );
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
                <span>Weight (KG/TONNES) (optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 10"
                  name="weight"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    changeOnCsvToAdvertArray("weight", e.target.value);
                  }}
                />
              </div>

              <div className="col-md-4 col-12">
                <span>Product Code (Optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g CEX56"
                  name="productCode"
                  value={productCode}
                  onChange={(e) => {
                    setProductCode(e.target.value);
                    changeOnCsvToAdvertArray("product_code", e.target.value);
                  }}
                />
              </div>

              <div className="col-md-4 col-12">
                <span>EAN (Optional)</span>

                <input
                  type="text"
                  className="txtbox mr-3 mt-3"
                  placeholder="E.g 12654"
                  name="ean"
                  value={ean}
                  onChange={(e) => {
                    setEAN(e.target.value);
                    changeOnCsvToAdvertArray("ean", e.target.value);
                  }}
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
            className="btn bulk-edit-btn float-right"
            type="submit"
            value="Submit"
          >
            CONTINUE TO PARSE DATA
          </button>
        </div>
      </form>

      {isBulkPhotoModalVisible && <BulkPhotoModal advertIndex={advertIndex} />}
    </div>
  ) : null;
};

export { BulkUpload_Edit };
