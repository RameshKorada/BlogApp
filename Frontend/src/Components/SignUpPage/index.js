import { Component } from "react";
import { Link } from "react-router-dom";

import "./index.css";

class SignUpPage extends Component {
  state = {
    name: "",
    username: "",
    password: "",
    reEnterPassword: "",
    email: "",
    nameStatus: false,
    usernameStatus: false,
    passwordStatus: false,
    emailStatus: false,
    reEnterPasswordStatus: false,
    isSuccessFull: false,
  };

  // getting user entering username data
  onUserName = (event) => {
    this.setState({ username: event.target.value });
  };

  // getting user entering name data
  onName = (event) => {
    this.setState({ name: event.target.value });
  };

  // getting user entering emnail data
  onEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  // getting user entering password data
  onPassword = (event) => {
    this.setState({ password: event.target.value });
  };

  // getting user entering re entering password data
  onReEnterPassword = (event) => {
    this.setState({ reEnterPassword: event.target.value });
  };

  // checking all the input field data entered or not

  allInputFiledDataChecking = (
    name,
    username,
    password,
    reEnterPassword,
    email
  ) => {
    //    const {nameStatus,usernameStatus,passwordStatus,emailStatus}=this.state

    name.length >= 1
      ? this.setState({ nameStatus: false })
      : this.setState({ nameStatus: true });
    username.length >= 5
      ? this.setState({ usernameStatus: false })
      : this.setState({ usernameStatus: true });
    password.length >= 8
      ? this.setState({ passwordStatus: false })
      : this.setState({ passwordStatus: true });
    email.length >= 1
      ? this.setState({ emailStatus: false })
      : this.setState({ emailStatus: true });

    if (password !== reEnterPassword) {
      this.setState({ reEnterPasswordStatus: true });
    } else {
      this.setState({ reEnterPasswordStatus: false });
    }
  };

  // on submit login button page logic
  onSubmitSignUpButton = async (event) => {
    event.preventDefault();

    const { name, username, password, reEnterPassword, email } = this.state;

    this.allInputFiledDataChecking(
      name,
      username,
      password,
      reEnterPassword,
      email
    );

    const details = {
      name,
      username,
      email,
      password,
    };

    const userDetails = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    if (
      name.length >= 1 &&
      username.length >= 5 &&
      password.length >= 8 &&
      email.length >= 1 &&
      password === reEnterPassword
    ) {
      //   console.log("asdsa")
      this.setState({ isSuccessFull: true });

      setInterval(() => {
        this.props.history.push("/login");
      }, 3000);

      const sendingUserDetailsToBackEnd = await fetch(
        "http://localhost:3004/signup",
        userDetails
      );
      //    console.log(sendingUserDetailsToBackEnd)
    } else {
      console.log("please enter all the details");
    }
  };

  // on successfull user register view

  userSuccessfullView = () => (
    <div>
      <h1>Successfully Registered.</h1>
    </div>
  );

  render() {
    const {
      nameStatus,
      usernameStatus,
      passwordStatus,
      emailStatus,
      reEnterPasswordStatus,
      isSuccessFull,
    } = this.state;
    // console.log(passwordStatus)

    return (
      <div className="signUp-page">
        {isSuccessFull ? (
          <div> {this.userSuccessfullView()}</div>
        ) : (
          <form
            className="sigup-form-container"
            onSubmit={this.onSubmitSignUpButton}
          >
            <div>
              <h1>Welcome to Ramesh Website</h1>
            </div>
            <div className="signup-container">
              <div className="label-element">
                <label className="signuplabelcontainer">Name:</label>
                <br />
                <input
                  onChange={this.onName}
                  className="signupinputcontainer"
                  type="text"
                  placeholder="name"
                />
                {nameStatus ? <span>Please Enter your Name</span> : " "}
              </div>
              <div className="label-element">
                <label className="signuplabelcontainer">Username:</label>
                <br />
                <input
                  onChange={this.onUserName}
                  className="signupinputcontainer"
                  type="text"
                  placeholder="username"
                />
                {usernameStatus ? (
                  <span>Username must be more than 5 characters</span>
                ) : (
                  " "
                )}
              </div>
              <div className="label-element">
                <label className="signuplabelcontainer">Email:</label>
                <br />
                <input
                  onChange={this.onEmail}
                  className="signupinputcontainer"
                  type="email"
                  placeholder="email"
                />
                {emailStatus ? <span>Please enter your E-Mail id</span> : " "}
              </div>
              <div className="label-element">
                <label className="signuplabelcontainer">password:</label>
                <br />
                <input
                  onChange={this.onPassword}
                  className="signupinputcontainer"
                  type="password"
                  placeholder="password"
                />
                {passwordStatus ? (
                  <span>Password must be more than 8 characters</span>
                ) : (
                  " "
                )}
              </div>
              <div className="label-element">
                <label className="signuplabelcontainer">
                  Re Enter Password:
                </label>
                <br />
                <input
                  onChange={this.onReEnterPassword}
                  className="signupinputcontainer"
                  type="password"
                  placeholder="Re Enter password"
                />
                {reEnterPasswordStatus ? (
                  <span>Password Didn't matched.</span>
                ) : (
                  " "
                )}
              </div>
              <div className="signup-buttons-container">
                <input
                  className="sign-up-button"
                  type="submit"
                  value="SignUp"
                />
                <Link to="/login">
                  <button className="login-button-from-signup" type="button">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}
export default SignUpPage;
