import { useState } from "react";
import {  Link,useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";
import "./index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ErrorShowingStatus, setErrorShowingStatus] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [showUserNameError, setShowUserNameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Setting JWT token in cookies
  const settingJwtToken = (jwtToken) => {
    Cookies.set("jwtToken", jwtToken, { expires: 30 });
    navigate("/"); // Redirect to home after login
  };

  // Sending username and password to the server
  const sendingUserNameAndPassword = async (e) => {
    e.preventDefault();

    const loginDetails = { username, password };

    const userDetails = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(loginDetails),
    };

    // Handling validation
    if (username.length === 0 || password.length === 0) {
      setShowUserNameError(username.length === 0);
      setShowPasswordError(password.length === 0);
    } else {
      try {
        const sendingData = await fetch("http://localhost:3004/login", userDetails);

        if (sendingData.ok) {
          const responseData = await sendingData.json();
          settingJwtToken(responseData.jwtToken);
          Cookies.set("username", username, { expires: 30 });
        } else {
          const errorResponse = await sendingData.json().catch(() => null);
          setErrorMessage(errorResponse.error);
          setErrorShowingStatus(true);
          setPassword(""); // Clear password
          setUsername(""); // Clear username
        }
      } catch (e) {
        console.error("Error:", e.message);
      }
    }
  };

  // Toggle password visibility
  const showPasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const pass = showPassword ? "text" : "password";

  const jwtToken = Cookies.get("jwtToken");
  if (jwtToken !== undefined) {
    navigate("/"); // Redirect to home if token exists
    return null; // Return null since redirect happens programmatically
  }

  return (
    <div className="login-page-container">
      <div className="login-form">
        <h1>Login Page</h1>
        <form onSubmit={sendingUserNameAndPassword}>
          <div className="input-container-elements">
            <label className="login-label">Username</label>
            <input
              className="input-field"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              value={username}
            />
            {showUserNameError && (
              <span className="error-message-element">
                * Please Enter Username
              </span>
            )}
          </div>

          <div className="input-container-elements">
            <label className="login-label">Password</label>
            <input
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              type={pass}
              value={password}
            />
            {showPasswordError && (
              <span className="error-message-element">
                * Please Enter Password
              </span>
            )}
            <div className="show-password-container">
              <input onClick={showPasswordToggle} type="checkbox" />
              <label>Show Password</label>
            </div>
          </div>

          <div className="login-button-container">
            <input className="login-button" type="submit" value="Login" />
            <br />
            <Link to="/signup" className="input-container-elements link-element">
              <span>New User? Please Register here...</span>
            </Link>
          </div>
        </form>

        {ErrorShowingStatus && (
          <span className="error-message-element">*{ErrorMessage}</span>
        )}
      </div>
    </div>
  );
};

export default Login;
