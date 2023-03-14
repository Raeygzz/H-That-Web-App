import React from "react";

import { ThreeCircles } from "react-loader-spinner";

const Loader = (props) => {
  const {} = props;

  return (
    // <div
    //   style={{
    //     position: "fixed",
    //     left: "50%",
    //     top: "35%",
    //     width: "100%",
    //     height: "100%",
    //   }}
    // >
    //   <BallTriangle color="#000"  />
    // </div>
    <>
      <div className="overlay-loader" 
      style={{
         position: "fixed",
         width: "100%",
         height: "100%",
         top: "0",
         left: "0",
         right: "0",
         bottom: "0",
         backgroundColor: "#ffffff70",
         zIndex: "1",
         cursor: "pointer"
      }}/>
      
      <div
        style={{
          position: "fixed",
          left: "46%",
          top: "40%",
          width: "120px",
          zIndex: "2",
          height: "120px",
        }}
        role="status"
      > 
      <ThreeCircles
        color="#ff6100"
        outerCircleColor="#000"
        height={110}
        width={110}
        ariaLabel="three-circles-rotating"
      />
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export { Loader };
