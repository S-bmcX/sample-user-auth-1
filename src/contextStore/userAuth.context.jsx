import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calcRemainTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainTime = adjExpirationTime - currentTime;

  return remainTime;
};

// BELOW IS FOR: use as a wrapper around over cmpt's that will get access to above context
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  // the above w/ local storage is possible b/c localStorage is a synchronus API

  const userIsLoggedIn = !!token;
  //   ^^ w/ !! states "not not token" and converts a truthy/fasly value into a boolean value ;; SO: if token is a string that IS empty it will return false ; if token is a string that IS NOT empty it will return true

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);

    const remainingTime = calcRemainTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
