import React, { useEffect } from "react";

import "./BulkUpload.css";
import { BulkUpload_Edit } from "../bulkUpload_edit/BulkUpload_Edit";
import { BulkUpload_Parse } from "../bulkUpload_parse/BulkUpload_Parse";
import { BulkUpload_Upload } from "../bulkUpload_upload/BulkUpload_Upload";
import { BulkUpload_Status } from "../bulkUpload_status/BulkUpload_Status";
import { BulkUpload_Complete } from "../bulkUpload_complete/BulkUpload_Complete";
import { BulkUpload_Configure } from "../bulkUpload_configure/BulkUpload_Configure";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedTask } from "../../toolkit/features/BulkUploadSlice";

const BulkUpload = (props) => {
  const {} = props;

  const { selectedTask } = useSelector((state) => state.bulkUpload);

  const dispatch = useDispatch();

  // scrolling to the top
  useEffect(() => {
    window.scrollTo({
      top: 200,
      left: 0,
      behavior: "smooth",
    });
  }, [selectedTask]);

  const taskSelectHandler = (task) => {
    // console.log("task ==> ", task);

    dispatch(setSelectedTask(task));
  };

  return (
    <div className="container">
      <div className="row py-4">
        <div className="col-12">
          <h1 className="title-upload pt-4 block">
            <b>CSV Bulk Upload</b>
          </h1>

          <p>Follow the steps below to bulk upload your kit on to Hire That!</p>
        </div>
      </div>

      {/* buttons */}
      <div className="row py-4">
        <div className="col">
          <button
            className={`${
              selectedTask === "upload" || selectedTask === "status"
                ? "bulk-btn-selected"
                : "bulk-btn"
            }`}
            onClick={taskSelectHandler.bind(this, "upload")}
          >
            <i className="fa fa-upload" aria-hidden="true" />
          </button>

          <b
            className={`ml-2 bulk-btn-txt ${
              (selectedTask === "upload" || selectedTask === "status") &&
              "orange"
            }`}
            onClick={taskSelectHandler.bind(this, "upload")}
          >
            Upload
          </b>
        </div>

        <div className="col">
          <button
            className={`${
              selectedTask === "configure" ? "bulk-btn-selected" : "bulk-btn"
            }`}
            // onClick={taskSelectHandler.bind(this, "configure")}
          >
            <i className="fa fa-window-maximize" aria-hidden="true" />
          </button>

          <b
            className={`ml-2 bulk-btn-txt ${
              selectedTask === "configure" && "orange"
            }`}
            // onClick={taskSelectHandler.bind(this, "configure")}
          >
            Configure
          </b>
        </div>

        <div className="col">
          <button
            className={`${
              selectedTask === "edit" ? "bulk-btn-selected" : "bulk-btn"
            }`}
            // onClick={taskSelectHandler.bind(this, "edit")}
          >
            <i className="fa fa-pencil" aria-hidden="true" />
          </button>

          <b
            className={`ml-2 bulk-btn-txt ${
              selectedTask === "edit" && "orange"
            }`}
            // onClick={taskSelectHandler.bind(this, "edit")}
          >
            Edit
          </b>
        </div>

        <div className="col">
          <button
            className={`${
              selectedTask === "parse" ? "bulk-btn-selected" : "bulk-btn"
            }`}
            // onClick={taskSelectHandler.bind(this, "parse")}
          >
            <i className="fa fa-file" aria-hidden="true" />
          </button>

          <b
            className={`ml-2 bulk-btn-txt ${
              selectedTask === "parse" && "orange"
            }`}
            // onClick={taskSelectHandler.bind(this, "parse")}
          >
            Parse
          </b>
        </div>

        <div className="col">
          <button
            className={`${
              selectedTask === "complete" ? "bulk-btn-selected" : "bulk-btn"
            }`}
            // onClick={taskSelectHandler.bind(this, "complete")}
          >
            <i className="fa fa-check" aria-hidden="true" />
          </button>

          <b
            className={`ml-2 bulk-btn-txt ${
              selectedTask === "complete" && "orange"
            }`}
            // onClick={taskSelectHandler.bind(this, "complete")}
          >
            Complete
          </b>
        </div>
      </div>

      <div className="row pb-4">
        <div className="col-12 pt-4 px-0">
          <div className="card card-upload">
            <div className="card-body p-4 m-2">
              {/* upload */}
              {selectedTask === "upload" && <BulkUpload_Upload />}

              {/* status */}
              {selectedTask === "status" && <BulkUpload_Status />}

              {/* configure */}
              {selectedTask === "configure" && <BulkUpload_Configure />}

              {/* edit */}
              {selectedTask === "edit" && <BulkUpload_Edit />}

              {/* parse */}
              {selectedTask === "parse" && <BulkUpload_Parse />}

              {/* complete */}
              {selectedTask === "complete" && <BulkUpload_Complete />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BulkUpload };
