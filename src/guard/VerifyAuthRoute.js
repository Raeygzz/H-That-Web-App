import React from "react";

import { Navigate, useLocation } from "react-router-dom";

import { AuthConsumer } from "../contexts";
import { UNAUTHEDURLS } from "../constants";

function VerifyAuthRoute({ children }) {
  const { isAuthenticated } = AuthConsumer();

  const { pathname } = useLocation();

  console.log("verifyAuthRoute-PATHNAME ==> ", pathname);
  console.log(`VerifyAuthRoute-ISAUTHENTICATED ==> `, isAuthenticated);

  if (isAuthenticated && UNAUTHEDURLS.includes(`${pathname}`)) {
    console.log("========= 5 ===========");
    return <Navigate to="/search-landing" replace />;
  }

  return children;
}

export { VerifyAuthRoute };
