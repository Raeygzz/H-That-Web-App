import { useState, useRef, useEffect } from "react";

import { useLocation } from "react-router-dom";

const useRoute = () => {
  const [currentRoute, setCurrentRoute] = useState("");
  const [previousRoute, setPreviousRoute] = useState("");

  const previousRouteRef = useRef();
  const currentRouteRef = useRef();

  const location = useLocation();
  // console.log("usePrevLocation ==> ", location);

  useEffect(() => {
    // current route
    currentRouteRef.current = location.pathname;
    setCurrentRoute(currentRouteRef.current);

    return () => {
      // previous route
      previousRouteRef.current = currentRouteRef.current;
      setPreviousRoute(previousRouteRef.current);
    };
  }, [location]);

  return { currentRoute, previousRoute };
};

export { useRoute };
