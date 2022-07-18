import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../contextStore/userAuth.context";

import classes from "./authForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();
  const emailInputRef = useRef("");
  const passwordInputRef = useRef("");

  const authContext = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEamil = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // option: Validation

    // SET LOADING BELOW
    setIsLoading(true);
    //
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyChhhXgN1HkUTyoHLI0PPxGJHaEvt5yVcw";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyChhhXgN1HkUTyoHLI0PPxGJHaEvt5yVcw";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEamil,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          // ..
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Auth Failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data);
        const expireTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        // the above has new Date() containing the same, the 2nd iteration inside is meant to take the data.expiresIn (using + to hard convert to integer) convert it to miliseconds by *1000 then add that to the current time stamp. Then set that calculated timestamp as a new Date const "expireTime" which is used below
        authContext.login(data.idToken, expireTime.toISOString());
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Submitting request...</p>}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
