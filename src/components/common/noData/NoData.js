import React from "react";

import { useNavigate } from "react-router-dom";

import "./NoData.css";

// anchor style
const anchorStyle = {
  fontWeight: "bold",
  color: "#ff6100",
  cursor: "pointer",
};

const NoData = ({
  firstMessage = "",
  navigateTo = "",
  anchorMessage = "",
  lastMessage = "",
}) => {
  const navigate = useNavigate();

  // goToHandler
  const goToHandler = () => {
    navigate(navigateTo);
  };

  return (
    <div className="container">
      <div className="col-12 mb-4 noDataGrey text-center">
        <div className="noDataP">
          {firstMessage}{" "}
          <a onClick={goToHandler} style={anchorStyle}>
            {anchorMessage}
          </a>{" "}
          {lastMessage}
        </div>
      </div>
    </div>
  );
};

export { NoData };
