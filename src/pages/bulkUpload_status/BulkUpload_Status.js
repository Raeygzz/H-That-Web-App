import React from "react";

import "./BulkUpload_Status.css";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedTask } from "../../toolkit/features/BulkUploadSlice";

const BulkUpload_Status = (props) => {
  // const { setSelectedTask } = props;

  const { csvFileName } = useSelector((state) => state.bulkUpload);

  const dispatch = useDispatch();

  const configureDataHandler = () => {
    dispatch(setSelectedTask("configure"));
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

      <div className="card card-bulk text-center">
        <b>{csvFileName}</b>

        <p className="mt-5 orange-no-pointer">
          <i className="fa fa-check" aria-hidden="true" />
          &nbsp; Your upload was successful.
        </p>
      </div>

      <button
        className="btn btn-upload-active col-lg-5 col-12 mt-3 float-right"
        onClick={configureDataHandler}
      >
        CONTINUE TO CONFIGURE DATA
      </button>
    </div>
  );
};

export { BulkUpload_Status };
