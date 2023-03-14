import React from "react";

import "./BulkUpload_Complete.css";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { resetBulkUpload } from "../../toolkit/features/BulkUploadSlice";
import {
  routeTo,
  setSelectedNavLinks,
} from "../../toolkit/features/AddressSlice";

const BulkUpload_Complete = (props) => {
  const {} = props;

  const { csvToAdverts } = useSelector((state) => state.bulkUpload);
  const { numberOfImportedAdverts } = useSelector((state) => state.bulkUpload);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exitToMyAdvertsHandler = () => {
    dispatch(resetBulkUpload());

    dispatch(setSelectedNavLinks(""));
    dispatch(routeTo("account-overview"));
    navigate("/my-account/account-overview");
  };

  return (
    <div>
      <b className="orange-no-pointer">Step 5 of 5</b>

      <h2 className="title-bulk-card mt-3">
        <b>Completed</b>
      </h2>

      <p className="spacing-bulk">
        {numberOfImportedAdverts} out of {csvToAdverts.length} items have been
        successfully imported.
      </p>

      <button className="btn bulk-edit-btn" onClick={exitToMyAdvertsHandler}>
        EXIT TO MY ACCOUNT OVERVIEW
      </button>
    </div>
  );
};

export { BulkUpload_Complete };
