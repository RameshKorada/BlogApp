import { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
    ErrorShowingStatus: false,
    ErrorMessage: "",
    showUserNameError: false,
    showPasswordError: false,
    showPassword: false,
  };

  // const history=useHistory()

  gettingUserName = (event) => {
    this.setState({ username: event.target.value });
  };

  gettinPassword = (event) => {
    this.setState({ password: event.target.value });
  };

  // setting jwtToken by using cookies

  settingJwtToken = (jwtToken) => {
    Cookies.set("jwtToken", jwtToken, { expires: 30 });

    const { history } = this.props;
    //  console.log(history)
    history.replace("/");
  };

  sendingUserNameAndPassword = async (e) => {
    e.preventDefault();

    const { username, password } = this.state;
    const loginDetails = {
      username,
      password,
    };

    const userDetails = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(loginDetails),
    };

    if (username.length === 0 || password.length === 0) {
      username.length === 0
        ? this.setState({ showUserNameError: true })
        : this.setState({ showUserNameError: false });
      password.length === 0
        ? this.setState({ showPasswordError: true })
        : this.setState({ showPasswordError: false });
    } else {
      try {
        const sendingData = await fetch(
          "http://localhost:3004/login",
          userDetails
        );
        console.log(sendingData);
        if (sendingData.ok) {
          const responseData = await sendingData.json();
          console.log("Response Data:", responseData);
          this.settingJwtToken(responseData.jwtToken);
          Cookies.set("username", username, { expires: 30 });
        } else if (!sendingData.ok) {
          const errorResponse = await sendingData.json().catch(() => null);
          console.log(errorResponse);
          this.setState({
            ErrorMessage: errorResponse.error,
            ErrorShowingStatus: true,
          });
          this.setState({password:""})
          this.setState({username:""})


        } else {
          console.error("Request failed with status:", sendingData.status);
        }
      } catch (e) {
        console.error("Error:", e.message);
      }
    }
  };

  // password showing function

  showPassword = () => {
    const { showPassword } = this.state;
    this.setState((prevState) => ({ showPassword: !showPassword }));
  };

  render() {
    const {
      ErrorMessage,
      ErrorShowingStatus,
      showUserNameError,
      showPasswordError,
      password,
      showPassword,
      username
    } = this.state;

    const pass = showPassword ? "text" : "password";

    const jwtToken = Cookies.get("jwtToken");
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login-page-container">
        <div className="login-form">
          <h1>Login Page</h1>
          <form onSubmit={this.sendingUserNameAndPassword}>
            <div className="input-container-elements">
              <label className="login-label">Username</label>
              <br />
              <input
                className="input-field"
                onChange={this.gettingUserName}
                type="text"
                value={username}
              />
              <br />
              {showUserNameError ? (
                <span className="error-message-element">
                  * Please Enter Username
                </span>
              ) : (
                " "
              )}
            </div>
            <div className="input-container-elements">
              <label className="login-label">Password</label>
              <br />
              <input
                className="input-field"
                onChange={this.gettinPassword}
                type={pass}
                value={password}
              />
              <br />
              {showPasswordError ? (
                <span className="error-message-element">
                  * Please Enter Password
                </span>
              ) : (
                " "
              )}
              <div className="show-password-contaier">
                <input onClick={this.showPassword} type="checkbox" />
                <label>Show Password</label>
              </div>
            </div>
            <div className="login-button-container">
              <input className="login-button" type="submit" value="Login" />
              <br />
              <Link
                to="/signup"
                className="input-container-elements link-element"
              >
                <span>New User? Please Register here...</span>
              </Link>
            </div>
          </form>
          {ErrorShowingStatus ? (
            <span className="error-message-element">*{ErrorMessage}</span>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Login;
