import React, { useState, useEffect } from "react";

import "./BulkUpload_Parse.css";
import { getObjectLength } from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import {
  setCreateAdvertIsLoadingComplete,
  createAdvertApi,
} from "../../toolkit/features/AdvertsSlice";
import {
  setSelectedTask,
  setBulkUploadCreateAdvertList,
} from "../../toolkit/features/BulkUploadSlice";

const BulkUpload_Parse = (props) => {
  const {} = props;

  const { csvToAdverts } = useSelector((state) => state.bulkUpload);
  const { numberOfImportedAdverts } = useSelector((state) => state.bulkUpload);
  const { createAdvertIsLoadingComplete } = useSelector(
    (state) => state.adverts
  );
  const { bulkUploadCreateAdvertList } = useSelector(
    (state) => state.bulkUpload
  );

  const [bulkUploadSingleCreateAdvert, setBulkUploadSingleCreateAdvert] =
    useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !createAdvertIsLoadingComplete &&
      bulkUploadCreateAdvertList.length > 0
    ) {
      console.log(
        "createAdvertIsLoadingComplete ==> ",
        createAdvertIsLoadingComplete
      );
      console.log(
        "bulkUploadCreateAdvertList ==> ",
        bulkUploadCreateAdvertList
      );

      bulkUploadCreateAdvertList.filter((obj, index) => {
        console.log("obj.name ==> ", obj.name);
        console.log(
          "bulkUploadCreateAdvertList[0].name ==> ",
          bulkUploadCreateAdvertList[0].name
        );

        if (
          !createAdvertIsLoadingComplete &&
          obj.name === bulkUploadCreateAdvertList[0].name
        ) {
          setBulkUploadSingleCreateAdvert(obj);
          dispatch(setCreateAdvertIsLoadingComplete(true));
        }
      });
    }
  }, [createAdvertIsLoadingComplete, bulkUploadCreateAdvertList]);

  console.log(
    "bulkUploadSingleCreateAdvert ==> ",
    bulkUploadSingleCreateAdvert
  );

  useEffect(() => {
    if (
      numberOfImportedAdverts != null &&
      bulkUploadCreateAdvertList.length > 0 &&
      getObjectLength(bulkUploadSingleCreateAdvert) != 0
    ) {
      console.log("numberOfImportedAdverts ==> ", numberOfImportedAdverts);
      console.log(
        "bulkUploadSingleCreateAdvert ==> ",
        bulkUploadSingleCreateAdvert
      );

      let remaining = bulkUploadCreateAdvertList.slice(1);
      console.log("remaining ==> ", remaining);
      dispatch(setBulkUploadCreateAdvertList(remaining));

      dispatch(createAdvertApi(bulkUploadSingleCreateAdvert));
      setBulkUploadSingleCreateAdvert([]);
    }
  }, [
    numberOfImportedAdverts,
    bulkUploadCreateAdvertList,
    bulkUploadSingleCreateAdvert,
  ]);

  useEffect(() => {
    if (numberOfImportedAdverts === csvToAdverts.length) {
      dispatch(setSelectedTask("complete"));
    }
  }, [numberOfImportedAdverts, csvToAdverts]);

  return (
    <div>
      <b className="orange-no-pointer">Step 4 of 5</b>

      <h2 className="title-bulk-card mt-3">
        <b>Parse Data</b>
      </h2>

      <p className="spacing-bulk">
        The items in your CSV file are being added as adverts to the Hire That
        system. Please do not navigate away from this page as it may corrupt the
        data that is being uploaded.
      </p>

      <div className="card card-bulk text-center">
        <b>Parsing Data</b>

        {/* <i
          className="fa fa-refresh bulk-parse-refresh rotate"
          aria-hidden="true"
        /> */}

        {/* clickable parse icon */}
        <a
          className="fa fa-refresh bulk-parse-refresh-a rotate"
          aria-hidden="true"
        />

        <progress
          className="progress-bulk mb-2"
          id="file"
          value={numberOfImportedAdverts}
          max={csvToAdverts.length}
        />

        {/* <progress className="progress-bulk mb-2" id="file" value={20} max={57}>
          {" "}
          32%{" "}
        </progress> */}

        <label htmlFor="file">
          Imported Successfully {numberOfImportedAdverts} /{" "}
          {csvToAdverts.length} Items
        </label>
      </div>
    </div>
  );
};

export { BulkUpload_Parse };
