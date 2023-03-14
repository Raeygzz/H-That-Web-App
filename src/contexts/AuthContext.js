import { createContext, useContext } from "react";

import { useSelector } from "react-redux";

const authContext = createContext();

function AuthProvider({ children }) {
  const { id } = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log("AuthProvider ==> ", id, isAuthenticated);

  const value = { id, isAuthenticated };
  return (
    <authContext.Provider value={value}>
      {children}
      {/*  */}
    </authContext.Provider>
  );
}

export { AuthProvider };

export const AuthConsumer = () => useContext(authContext);
