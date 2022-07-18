import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../contextStore/userAuth.context";

import classes from "./profileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef("");
  const history = useNavigate();

  const authContext = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyChhhXgN1HkUTyoHLI0PPxGJHaEvt5yVcw",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authContext.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      // assume success
      history("/", { replace: true });
    });
    // Instead of catching an error, a forced min-length is set on the password input ;; just done for speed/ease,all fetch requests should be converted to asyc/await hooks with proper error handling
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="5"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
