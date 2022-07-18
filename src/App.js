import React, { useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import AuthContext from "./contextStore/userAuth.context";

import Layout from "./components/layout/layout.cmpt";
import UserProfile from "./components/profile/userProfile.cmpt";
import AuthPage from "./pages/authPage";
import HomePage from "./pages/homePage";

import "./App.css";

function App() {
  const authContext = useContext(AuthContext);

  // const history = useNavigate();

  return (
    <Layout>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        {!authContext.isLoggedIn && (
          <Route path="/auth" element={<AuthPage />} />
        )}
        {authContext.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )}
        {/* <Route path="*" element={history("/", { replace: true })} /> */}
      </Routes>
    </Layout>
  );
}

export default App;
