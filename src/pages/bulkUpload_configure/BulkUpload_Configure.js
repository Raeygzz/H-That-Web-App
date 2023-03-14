import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./BulkUpload_Configure.css";
import { getObjectLength } from "../../utils";
import { findAddressFromPostcode } from "../../services/axios/Api";

import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedTask,
  setCsvToAdverts,
  bulkUploadTemplateApi,
} from "../../toolkit/features/BulkUploadSlice";

const BulkUpload_Configure = (props) => {
  // const { setSelectedTask } = props;

  const { addressPickerList } = useSelector((state) => state.address);
  const { csvTojson } = useSelector((state) => state.bulkUpload);
  // console.log("csvTojson ==> ", csvTojson);
  const { bulkUploadTemplate } = useSelector((state) => state.bulkUpload);

  // id
  const [id, setId] = useState("");

  // title
  const [advertTitle, setAdvertTitle] = useState("");

  // advertise for hire / sale
  const [advertiseToHire, setAdvertiseToHire] = useState("");
  const [advertiseToSale, setAdvertiseToSale] = useState("");

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

  // address
  const [location, setLocation] = useState("");
  const [isManualAddress, setIsManualAddress] = useState("");

  // postcode
  const [postcode, setPostcode] = useState("");
  const [manualAddressesLatLon, setManualAddressesLatLon] = useState([]);

  // collection available
  const [collectionAvailable, setCollectionAvailable] = useState("");

  // delivery available
  const [deliveryAvailable, setDeliveryAvailable] = useState("");

  // delivery distance
  const [deliveryDistance, setDeliveryDistance] = useState("");

  // delivery charge
  const [deliveryCharge, setDeliveryCharge] = useState("");

  // hire price
  const [values, setValues] = useState([
    { id: 0, perDayPrice: "" },
    { id: 1, perDayPrice: "" },
    { id: 2, perDayPrice: "" },
    { id: 3, perDayPrice: "" },
    { id: 4, perDayPrice: "" },
    { id: 5, perDayPrice: "" },
    { id: 6, perDayPrice: "" },
  ]);

  // for sale
  const [forSale, setForSale] = useState("");

  // plus vat
  const [plusVAT, setPlusVAT] = useState("");

  // offers accepted
  const [offersAccepted, setOffersAccepted] = useState("");

  // weight
  const [weight, setWeight] = useState("");

  // product code
  const [productCode, setProductCode] = useState("");

  // ean
  const [ean, setEAN] = useState("");

  // csvFirstItemDisplay
  const [csvFirstItemDisplay, setCsvFirstItemDisplay] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (getObjectLength(bulkUploadTemplate) != 0) {
      setId(bulkUploadTemplate.id);
      setAdvertTitle(bulkUploadTemplate.title);
      setAdvertiseToHire(bulkUploadTemplate.is_for_hire);
      setAdvertiseToSale(bulkUploadTemplate.is_for_sale);
      setAdvertCategory(bulkUploadTemplate.category_id);
      setAdvertSubCategory(bulkUploadTemplate.sub_category_id);
      setMake(bulkUploadTemplate.make);
      setModel(bulkUploadTemplate.model);
      setDescription(bulkUploadTemplate.description);
      setAge(bulkUploadTemplate.age);
      setMileage(bulkUploadTemplate.mileage);
      setHoursUsed(bulkUploadTemplate.hours_used);
      setLength(bulkUploadTemplate.length_mm);
      setWidth(bulkUploadTemplate.width_mm);
      setDepth(bulkUploadTemplate.height_mm);
      setPostcode(bulkUploadTemplate.post_code);
      setLocation(bulkUploadTemplate.location);
      setIsManualAddress(bulkUploadTemplate.is_manual_address);
      setCollectionAvailable(bulkUploadTemplate.is_for_collection);
      setDeliveryAvailable(bulkUploadTemplate.is_for_delivery);
      setDeliveryDistance(bulkUploadTemplate.delivery_distance);
      setDeliveryCharge(bulkUploadTemplate.delivery_charge_mile);

      values[0].perDayPrice = bulkUploadTemplate.price_day_1;
      values[1].perDayPrice = bulkUploadTemplate.price_day_2;
      values[2].perDayPrice = bulkUploadTemplate.price_day_3;
      values[3].perDayPrice = bulkUploadTemplate.price_day_4;
      values[4].perDayPrice = bulkUploadTemplate.price_day_5;
      values[5].perDayPrice = bulkUploadTemplate.price_day_6;
      values[6].perDayPrice = bulkUploadTemplate.price_day_7;

      setForSale(bulkUploadTemplate.selling_price);
      setPlusVAT(bulkUploadTemplate.vat);
      setOffersAccepted(bulkUploadTemplate.offers_accepted);
      setWeight(bulkUploadTemplate.weight);
      setProductCode(bulkUploadTemplate.product_code);
      setEAN(bulkUploadTemplate.ean);
    }
  }, [bulkUploadTemplate]);

  // useEffect(() => {
  //   // comment this on last
  //   setId("id");
  //   setAdvertTitle("name");
  //   setAdvertiseToHire("is_for_hire");
  //   setAdvertiseToSale("is_for_sale");
  //   setAdvertCategory("category_id");
  //   setAdvertSubCategory("sub_category_id");
  //   setMake("making");
  //   setModel("modeling");
  //   setDescription("desc");
  //   setAge("umayer");
  //   setMileage("mileage");
  //   setHoursUsed("hours_used");
  //   setLength("length_mm");
  //   setWidth("width_mm");
  //   setDepth("height_mm");
  //   setPostcode("post_code");
  //   setLocation("location");
  //   setIsManualAddress("is_manual_address");
  //   setCollectionAvailable("is_for_collection");
  //   setDeliveryAvailable("is_for_delivery");
  //   setDeliveryDistance("delivery_distance");
  //   setDeliveryCharge("delivery_charge_mile");
  //   setValues([
  //     { id: 0, perDayPrice: "price_day_1" },
  //     { id: 1, perDayPrice: "price_day_2" },
  //     { id: 2, perDayPrice: "price_day_3" },
  //     { id: 3, perDayPrice: "price_day_4" },
  //     { id: 4, perDayPrice: "price_day_5" },
  //     { id: 5, perDayPrice: "price_day_6" },
  //     { id: 6, perDayPrice: "price_day_7" },
  //   ]);
  //   setForSale("selling_price");
  //   setPlusVAT("vat");
  //   setOffersAccepted("offers_accepted");
  //   setWeight("weight");
  //   setProductCode("product_code");
  //   setEAN("ean");
  // }, []);

  useEffect(() => {
    if (csvTojson.length > 0) {
      for (let i = 0; i < csvTojson.length; i++) {
        if (csvTojson[i].is_manual_address === "1") {
          findAddressFromPostcode(csvTojson[i].post_code)
            .then((res) => {
              if (res?.status === 200) {
                callbacks(
                  csvTojson[i].post_code,
                  res.data.latitude,
                  res.data.longitude
                );
              }
            })
            .catch((error) => {
              // console.log("error ==> ", error.response);
            });
        }
      }
    }
  }, [csvTojson]);

  useEffect(() => {
    if (csvTojson.length > 0) {
      csvTojson.slice(0, 1).forEach((obj) => {
        Object.keys(obj).forEach((key) => {
          // console.log("key : " + key + " - value : " + obj[key]);

          setCsvFirstItemDisplay((prevArray) => [
            ...prevArray,
            { [key]: obj[key] },
          ]);
        });
      });
    }
  }, [csvTojson]);

  // callbacks
  const callbacks = (post_code, lat, lon) => {
    // console.log("lat ==> ", lat);
    // console.log("lon ==> ", lon);
    // console.log("post_code ==> ", post_code);

    setManualAddressesLatLon((prevArray) => [
      ...prevArray,
      { post_code: post_code, lat: lat, lon: lon },
    ]);
  };

  // saveSettingsForFutureImportsHandler
  const saveSettingsForFutureImportsHandler = (handler) => {
    let obj = {
      navigate: navigate,
      from: handler,
      id: id,
      title: advertTitle,
      is_for_hire: advertiseToHire,
      is_for_sale: advertiseToSale,
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
      is_manual_address: isManualAddress,
      location: location,
      post_code: postcode,
      is_for_collection: collectionAvailable,
      is_for_delivery: deliveryAvailable,
      delivery_distance: deliveryDistance,
      delivery_charge_mile: deliveryCharge,
      price_day_1: values[0].perDayPrice,
      price_day_2: values[1].perDayPrice,
      price_day_3: values[2].perDayPrice,
      price_day_4: values[3].perDayPrice,
      price_day_5: values[4].perDayPrice,
      price_day_6: values[5].perDayPrice,
      price_day_7: values[6].perDayPrice,
      weight: weight,
      product_code: productCode,
      ean: ean,
      vat: plusVAT,
      selling_price: forSale,
      offers_accepted: offersAccepted,
      accepted_terms_and_conditions: 1,
    };

    dispatch(bulkUploadTemplateApi(obj));
  };

  // configureAdvertsHandler
  const configureAdvertsHandler = () => {
    let tempArr = [];
    let tempAddressArr = [];

    for (let m = 0; m < addressPickerList.length; m++) {
      for (let n = 0; n < csvTojson.length; n++) {
        if (
          addressPickerList[m].label.toLowerCase() ===
          csvTojson[n].location.toLowerCase()
        ) {
          tempAddressArr.push(addressPickerList[m]);
        }
      }
    }

    // console.log("tempAddressArr ==> ", tempAddressArr);

    for (let i = 0; i < csvTojson.length; i++) {
      if (csvTojson[i].is_manual_address === "0") {
        let xyz = csvTojson[i].location;
        // console.log("xyz ==> ", xyz);

        let know = tempAddressArr.find((obj) => {
          return obj.label === xyz;
        });
        // console.log("know ==> ", know);

        if (know !== undefined) {
          tempArr.push({
            id: csvTojson[i][id],
            title: csvTojson[i][advertTitle],
            is_for_hire: csvTojson[i][advertiseToHire],
            is_for_sale: csvTojson[i][advertiseToSale],
            category_id: csvTojson[i][advertCategory],
            sub_category_id: csvTojson[i][advertSubCategory],
            make: csvTojson[i][make],
            model: csvTojson[i][model],
            description: csvTojson[i][description],
            age: csvTojson[i][age],
            mileage: csvTojson[i][mileage],
            hours_used: csvTojson[i][hoursUsed],
            length_mm: csvTojson[i][length],
            width_mm: csvTojson[i][width],
            height_mm: csvTojson[i][depth],
            is_manual_address: csvTojson[i][isManualAddress],
            location: csvTojson[i][location],
            post_code: csvTojson[i][postcode],
            latitude: know.lat,
            longitude: know.lon,
            is_for_collection: csvTojson[i][collectionAvailable],
            is_for_delivery: csvTojson[i][deliveryAvailable],
            delivery_distance: csvTojson[i][deliveryDistance],
            delivery_charge_mile: csvTojson[i][deliveryCharge],
            price_day_1: csvTojson[i][values[0].perDayPrice],
            price_day_2: csvTojson[i][values[1].perDayPrice],
            price_day_3: csvTojson[i][values[2].perDayPrice],
            price_day_4: csvTojson[i][values[3].perDayPrice],
            price_day_5: csvTojson[i][values[4].perDayPrice],
            price_day_6: csvTojson[i][values[5].perDayPrice],
            price_day_7: csvTojson[i][values[6].perDayPrice],
            weight: csvTojson[i][weight],
            product_code: csvTojson[i][productCode],
            ean: csvTojson[i][ean],
            vat: csvTojson[i][plusVAT],
            selling_price: csvTojson[i][forSale],
            offers_accepted: csvTojson[i][offersAccepted],
            accepted_terms_and_conditions: 1,
          });
        }

        if (know === undefined) {
          tempArr.push({
            id: csvTojson[i][id],
            title: csvTojson[i][advertTitle],
            is_for_hire: csvTojson[i][advertiseToHire],
            is_for_sale: csvTojson[i][advertiseToSale],
            category_id: csvTojson[i][advertCategory],
            sub_category_id: csvTojson[i][advertSubCategory],
            make: csvTojson[i][make],
            model: csvTojson[i][model],
            description: csvTojson[i][description],
            age: csvTojson[i][age],
            mileage: csvTojson[i][mileage],
            hours_used: csvTojson[i][hoursUsed],
            length_mm: csvTojson[i][length],
            width_mm: csvTojson[i][width],
            height_mm: csvTojson[i][depth],
            is_manual_address: csvTojson[i][isManualAddress],
            location: csvTojson[i][location],
            post_code: csvTojson[i][postcode],
            latitude: "",
            longitude: "",
            is_for_collection: csvTojson[i][collectionAvailable],
            is_for_delivery: csvTojson[i][deliveryAvailable],
            delivery_distance: csvTojson[i][deliveryDistance],
            delivery_charge_mile: csvTojson[i][deliveryCharge],
            price_day_1: csvTojson[i][values[0].perDayPrice],
            price_day_2: csvTojson[i][values[1].perDayPrice],
            price_day_3: csvTojson[i][values[2].perDayPrice],
            price_day_4: csvTojson[i][values[3].perDayPrice],
            price_day_5: csvTojson[i][values[4].perDayPrice],
            price_day_6: csvTojson[i][values[5].perDayPrice],
            price_day_7: csvTojson[i][values[6].perDayPrice],
            weight: csvTojson[i][weight],
            product_code: csvTojson[i][productCode],
            ean: csvTojson[i][ean],
            vat: csvTojson[i][plusVAT],
            selling_price: csvTojson[i][forSale],
            offers_accepted: csvTojson[i][offersAccepted],
            accepted_terms_and_conditions: 1,
          });
        }
      }

      if (csvTojson[i].is_manual_address === "1") {
        let particularLatLon = manualAddressesLatLon.find((ele) => {
          return ele.post_code === csvTojson[i].post_code;
        });

        tempArr.push({
          id: csvTojson[i][id],
          title: csvTojson[i][advertTitle],
          is_for_hire: csvTojson[i][advertiseToHire],
          is_for_sale: csvTojson[i][advertiseToSale],
          category_id: csvTojson[i][advertCategory],
          sub_category_id: csvTojson[i][advertSubCategory],
          make: csvTojson[i][make],
          model: csvTojson[i][model],
          description: csvTojson[i][description],
          age: csvTojson[i][age],
          mileage: csvTojson[i][mileage],
          hours_used: csvTojson[i][hoursUsed],
          length_mm: csvTojson[i][length],
          width_mm: csvTojson[i][width],
          height_mm: csvTojson[i][depth],
          is_manual_address: csvTojson[i][isManualAddress],
          location: csvTojson[i][location],
          post_code: csvTojson[i][postcode],
          latitude: particularLatLon?.lat,
          longitude: particularLatLon?.lon,
          is_for_collection: csvTojson[i][collectionAvailable],
          is_for_delivery: csvTojson[i][deliveryAvailable],
          delivery_distance: csvTojson[i][deliveryDistance],
          delivery_charge_mile: csvTojson[i][deliveryCharge],
          price_day_1: csvTojson[i][values[0].perDayPrice],
          price_day_2: csvTojson[i][values[1].perDayPrice],
          price_day_3: csvTojson[i][values[2].perDayPrice],
          price_day_4: csvTojson[i][values[3].perDayPrice],
          price_day_5: csvTojson[i][values[4].perDayPrice],
          price_day_6: csvTojson[i][values[5].perDayPrice],
          price_day_7: csvTojson[i][values[6].perDayPrice],
          weight: csvTojson[i][weight],
          product_code: csvTojson[i][productCode],
          ean: csvTojson[i][ean],
          vat: csvTojson[i][plusVAT],
          selling_price: csvTojson[i][forSale],
          offers_accepted: csvTojson[i][offersAccepted],
          accepted_terms_and_conditions: 1,
        });
      }
    }

    console.log("setCsvToAdverts-tempArr ==> ", tempArr);
    dispatch(setCsvToAdverts(tempArr));
    saveSettingsForFutureImportsHandler("configureAdvertsHandler");

    dispatch(setSelectedTask("edit"));
  };

  // handleChange
  const handleChange = (i, e) => {
    // console.log("i, e ==> ", i, e);

    let tempArr = [];
    values.forEach((item, index) => {
      if (item.id == i) {
        tempArr = [...values, (values[index].perDayPrice = e.target.value)];
      }
    });

    console.log("termpArr-tabularPerDayPrice ==> ", tempArr);
    tempArr.splice(7);

    setValues(tempArr);
  };

  let tabularPerDayPrice = [];
  for (let i = 0; i <= 6; i++) {
    tabularPerDayPrice.push(
      <div key={i} className="row row-configure-card2">
        <div className="col-5 flamabold p-0 pt-2">{`price_day_${i + 1}`}</div>

        <div className="col-7">
          <input
            type="text"
            className="form-control"
            name={values[i].perDayPrice}
            value={values[i].perDayPrice}
            onChange={handleChange.bind(this, i)}
          />
        </div>
      </div>
    );
  }

  let firstItemDisplay =
    csvFirstItemDisplay.length > 0
      ? csvFirstItemDisplay.map((obj, index) => {
          // console.log("obj ==> ", obj);

          return (
            <div key={index} className="row row-configure-card">
              <div className="col-5 flamabold p-0">{Object.keys(obj)}</div>

              <div className="col-7">{Object.values(obj)}</div>
            </div>
          );
        })
      : null;

  // console.log("csvFirstItemDisplay ==> ", csvFirstItemDisplay);
  // console.log("manualAddressesLatLon ==> ", manualAddressesLatLon);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        configureAdvertsHandler();
      }}
    >
      <b className="orange-no-pointer">Step 2 of 5</b>

      <h2 className="title-configure-card mt-3">
        <b>Configure import data</b>
      </h2>

      <p className="spacing-bulk">
        The first item from your CSV is displayed on the left. On the right are
        the fields that Hire That uses for each advert. Hire That will create
        adverts using the import template you create here. For example: if your
        titles are called “name” in your CSV, type in “name” for the title field
        in the template.
      </p>

      <div className="row mt-3">
        {/* Left */}
        <div className="col-lg-6 col-12 pt-5">
          <div className="subtitle-configure">
            {`Imported CSV File – Item 1 of ${csvTojson.length}`}
          </div>

          <div className="card card-configure pb-1 pt-3 px-5">
            {firstItemDisplay}
          </div>
        </div>

        {/* Right */}
        <div className="col-lg-6 col-12 pt-5">
          <div className="subtitle-configure">
            Hire That Advert Import Template
          </div>

          <div className="px-3">
            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">id</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">title</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="advertTitle"
                  value={advertTitle}
                  onChange={(e) => setAdvertTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">is_for_hire</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="advertiseToHire"
                  value={advertiseToHire}
                  onChange={(e) => setAdvertiseToHire(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">is_for_sale</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="advertiseToSale"
                  value={advertiseToSale}
                  onChange={(e) => setAdvertiseToSale(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">category_id</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={advertCategory}
                  onChange={(e) => setAdvertCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">sub_category_id</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="subCategory"
                  value={advertSubCategory}
                  onChange={(e) => setAdvertSubCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">make</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">model</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">description</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">age</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">mileage</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="mileage"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">hours_used</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="hoursUsed"
                  value={hoursUsed}
                  onChange={(e) => setHoursUsed(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">length_mm</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">width_mm</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">height_mm</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">is_manual_address</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="isManualAddress"
                  value={isManualAddress}
                  onChange={(e) => setIsManualAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">location</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">post_code</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">is_for_collection</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="collectionAvailable"
                  value={collectionAvailable}
                  onChange={(e) => setCollectionAvailable(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">is_for_delivery</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="deliveryAvailable"
                  value={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">delivery_distance</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="deliveryDistance"
                  value={deliveryDistance}
                  onChange={(e) => setDeliveryDistance(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">
                delivery_charge_mile
              </div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="deliveryCharge"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  required
                />
              </div>
            </div>

            {tabularPerDayPrice}

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">selling_price</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="forSale"
                  value={forSale}
                  onChange={(e) => setForSale(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">vat</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="plusVAT"
                  value={plusVAT}
                  onChange={(e) => setPlusVAT(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">offers_accepted</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="offersAccepted"
                  value={offersAccepted}
                  onChange={(e) => setOffersAccepted(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">weight</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">product_code</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="productCode"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row row-configure-card2">
              <div className="col-5 flamabold p-0 pt-2">ean</div>

              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  name="ean"
                  value={ean}
                  onChange={(e) => setEAN(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="container">
        <div className="row flex-row-reverse">
          <div
            className="col-lg-6 col-12 mt-3 py-3 text-center"
            onClick={saveSettingsForFutureImportsHandler.bind(
              this,
              "saveSettingsForFutureImportsHandler"
            )}
          >
            <a className="a-configure">SAVE SETTINGS FOR FUTURE IMPORTS</a>
          </div>
        </div>

        <div className="row flex-row-reverse">
          <button className="btn btn-upload-active col-lg-6 col-12 mt-3">
            SAVE CONFIGURATION &amp; CONTINUE
          </button>
        </div>
      </div>
    </form>
  );
};

export { BulkUpload_Configure };
