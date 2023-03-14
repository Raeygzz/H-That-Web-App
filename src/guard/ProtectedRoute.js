import React, { useEffect } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { AuthConsumer } from "../contexts";
import { UNAUTHEDURLS, FROMEXTERNAL } from "../constants";

import { useSelector, useDispatch } from "react-redux";
import { setExternalPathname } from "../toolkit/features/AuthSlice";

function ProtectedRoute({ children }) {
  const { externalPathname } = useSelector((state) => state.auth);
  // const { has_primary_address } = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isAuthenticated } = AuthConsumer();

  console.log("protectedRoute-PATHNAME ==> ", pathname);
  console.log("protectedRoute-ISAUTHENTICATED ==> ", isAuthenticated);
  console.log("protectedRoute-EXTERNALPATHNAME ==> ", externalPathname);

  useEffect(() => {
    if (FROMEXTERNAL.includes(`/${pathname.split("/")[1]}`)) {
      console.log("========= 6 =========");
      dispatch(setExternalPathname(pathname));
      return;
    }

    // if (has_primary_address === 1) {
    console.log("========= 7 =========");
    dispatch(setExternalPathname(pathname));
    // }
  }, [
    isAuthenticated,
    // has_primary_address
  ]);

  if (isAuthenticated && UNAUTHEDURLS.includes(`${pathname}`)) {
    if (externalPathname != "") {
      console.log("========= 8 =========");
      return <Navigate to={externalPathname} replace />;
    }

    console.log("========= 9 =========");
    return <Navigate to="/search-landing" replace />;
  }

  console.log("========= 10 =========");
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export { ProtectedRoute };
