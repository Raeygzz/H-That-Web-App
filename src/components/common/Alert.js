import React from "react";

const Alert = (props) => {
  // console.log("props ==> ", props);

  const {
    showSuccess = false,
    showError = false,
    successMessage = "",
    errorMessage = "",
  } = props;

  return (
    (showSuccess || showError) && (
      <div
        className={`alert ${showSuccess ? "alert-success" : "alert-danger"}`}
        role="alert"
      >
        {showSuccess ? successMessage : errorMessage}
      </div>
    )
  );
};

export { Alert };
//
//
// import React, { useState, useEffect } from "react";

// const Alert = (props) => {
//   // console.log("props ==> ", props);

//   const {
//     showSuccess = false,
//     showError = false,
//     successMessage = "",
//     errorMessage = "",
//     setClearTimer = false,
//     time = 1500,
//   } = props;

//   const [isSuccess, setIsSucess] = useState(false);
//   const [isSuccessMessage, setIsSuccessMessage] = useState("");

//   const [isError, setIsError] = useState(false);
//   const [isErrorMessage, setIsErrorMessage] = useState("");

//   useEffect(() => {
//     if (showSuccess) {
//       setIsSucess(showSuccess);
//     }

//     if (successMessage != "") {
//       setIsSuccessMessage(successMessage);
//     }

//     if (showError) {
//       setIsError(showError);
//     }

//     if (errorMessage != "") {
//       setIsErrorMessage(errorMessage);
//     }
//   }, [showSuccess, successMessage, showError, errorMessage]);

//   useEffect(() => {
//     if (setClearTimer) {
//       setTimeout(() => {
//         setIsSucess(false);
//         setIsSuccessMessage("");
//         setIsError(false);
//         setIsErrorMessage("");
//       }, time);
//     }
//   }, [setClearTimer]);

//   return (
//     (isSuccess || isError) && (
//       <div
//         className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}
//         role="alert"
//       >
//         {isSuccess ? isSuccessMessage : isErrorMessage}
//       </div>
//     )
//   );
// };

// export { Alert };
