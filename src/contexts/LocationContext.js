import React, { createContext, useContext } from "react";

import { useRoute } from "../hooks";

const locationContext = createContext();

function LocationProvider({ children }) {
  const { currentRoute, previousRoute } = useRoute();

  // console.log("currentRoute ==> ", currentRoute);
  // console.log("previousRoute ==> ", previousRoute);

  const value = { currentRoute, previousRoute };
  return (
    <locationContext.Provider value={value}>
      {children}
      {/*  */}
    </locationContext.Provider>
  );
}

export { LocationProvider };

export const LocationConsumer = () => useContext(locationContext);
