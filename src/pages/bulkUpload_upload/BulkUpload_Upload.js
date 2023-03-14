import React, { useEffect, useMemo, useCallback } from "react";

import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import "./BulkUpload_Upload.css";
import { getObjectLength } from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedTask,
  setCsvFileName,
  setCsvToJson,
  resetBulkUpload,
  getBulkUploadTemplateApi,
  setBulkUploadTemplate,
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

// ACTUAL_HEADER
const ACTUAL_HEADER = [
  "id",
  "title",
  "description",
  "category_name",
  "sub_category_name",
  "category_id",
  "sub_category_id",
  "make",
  "model",
  "length_mm",
  "width_mm",
  "height_mm",
  "post_code",
  "location",
  "is_manual_address",
  "delivery_charge_mile",
  "is_for_hire",
  "is_for_sale",
  "selling_price",
  "is_for_delivery",
  "is_for_collection",
  "delivery_distance",
  "offers_accepted",
  "product_code",
  "ean",
  "weight",
  "mileage",
  "hours_used",
  "accepted_terms",
  "age",
  "vat",
  "price_day_1",
  "price_day_2",
  "price_day_3",
  "price_day_4",
  "price_day_5",
  "price_day_6",
  "price_day_7",
];

const BulkUpload_Upload = (props) => {
  const {} = props;

  const { csvTojson } = useSelector((state) => state.bulkUpload);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetBulkUpload());
    dispatch(getBulkUploadTemplateApi());
  }, []);

  // onDrop
  const onDrop = useCallback((acceptedFiles) => {
    // console.log("acceptedFiles ==> ", acceptedFiles);
    // console.log("acceptedFiles.length ==> ", acceptedFiles.length);

    dispatch(setCsvFileName(acceptedFiles[0].name));

    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        // console.log("text ==> ", text);

        processCSV(text);
      };

      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, multiple: true, accept: ".csv" });

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

  const processCSV = (str, delim = ",") => {
    const headers = str
      .slice(0, str.indexOf("\n"))
      .split(delim)
      .map((obj) => {
        return obj.split("\r")[0];
      });

    // console.log("headers ==> ", headers);

    let tempObj = {};
    ACTUAL_HEADER.filter((env, i) => {
      tempObj[env] = headers[i];
    });

    if (getObjectLength(tempObj) != 0) {
      dispatch(setBulkUploadTemplate(tempObj));
    }

    // const rows = str
    //   .slice(str.indexOf("\n") + 1)
    //   .split("\n")
    //   .map((obj) => {
    //     return obj.split("\r")[0];
    //   });
    // console.log("rows ==> ", rows);

    const rows1 = str.slice(str.indexOf("\n") + 1);
    // console.log("rows1 ==> ", rows1);

    let quoteIndex = "";
    let finalRows = "";
    for (let i = 0; i < rows1.length; i++) {
      if (rows1[i] === '"') {
        quoteIndex = quoteIndex + " " + i;
      }
    }

    if (quoteIndex != "") {
      // console.log("quoteIndex ==> ", quoteIndex);

      let firstQuoteIndex = parseInt(quoteIndex.split(" ")[1]);
      let lastQuoteIndex = parseInt(quoteIndex.split(" ")[2]);

      // console.log("firstQuoteIndex ==> ", firstQuoteIndex);
      // console.log("lastQuoteIndex ==> ", lastQuoteIndex);

      let finalDesc = rows1
        .slice(firstQuoteIndex, lastQuoteIndex)
        .replace(/(\r\n|\n|\r|")/gm, "");

      // console.log("finalDesc ==> ", finalDesc);

      for (let i = 0; i < rows1.length; i++) {
        if (i < firstQuoteIndex) {
          finalRows = finalRows + rows1[i];
        }

        if (i === firstQuoteIndex) {
          finalRows = finalRows + finalDesc;
        }

        if (i > lastQuoteIndex) {
          finalRows = finalRows + rows1[i];
        }
      }
    }

    if (quoteIndex == "") {
      finalRows = rows1;
      // console.log("finalRows ==> ", finalRows);
    }

    const rows2 = finalRows.split("\n");
    // console.log("rows2 ==> ", rows2);

    // const rows3 = rows2.map((obj) => {
    //   // console.log("obj ==> ", obj);
    //   return obj.split("\r")[0];
    // });

    let rows3 = [];
    rows2.forEach((obj, index) => {
      if (obj != "" && obj.length > 0) {
        // console.log("obj ==> ", obj);

        rows3.push(obj.split("\r")[0]);
      }
    });

    // console.log("rows3 ==> ", rows3);

    let newArray = rows3.map((row) => {
      let values = row.split(delim);
      // console.log("values ==> ", values);

      let eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];

        // console.log("obj ==> ", obj);
        return obj;
      }, {});

      // console.log("eachObject ==> ", eachObject);
      return eachObject;
    });

    dispatch(setCsvToJson(newArray));
  };

  const uploadFileHandler = () => {
    if (csvTojson.length > 0) {
      dispatch(setSelectedTask("status"));

      return;
    }

    toast("Please upload the .CSV file first.", {
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
  };

  return (
    <div>
      <b className="orange-no-pointer">Step 1 of 5</b>

      <h2 className="title-bulk-card mt-3">
        <b>Upload your CSV file</b>
      </h2>

      <p className="spacing-bulk">
        Choose a CSV file that has all the kit that you’d like to upload. The
        data will be imported into Hire That as new items.
        <br />
        You cannot use this method to replace existing items.
      </p>

      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />

        <div className="my-auto text-center pt-5">
          <i className="fa fa-file add-icon" aria-hidden="true"></i>
          <br />
          <br />

          <i className="fa fa-plus-circle add-image" aria-hidden="true">
            <p className="flama inline-block">
              &nbsp;Click here or drag .csv file to upload
            </p>
          </i>
        </div>
      </div>

      <button
        className={`btn ${
          csvTojson.length > 0 ? "btn-upload-active" : "btn-upload"
        } col-lg-3 col-md-5 col-12 mt-4 float-right`}
        onClick={uploadFileHandler}
      >
        UPLOAD FILE
      </button>
    </div>
  );
};

export { BulkUpload_Upload };
