import React, { Component } from "react";
import "./Login-Register.css";
import { GoogleLogin } from "react-google-login";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };
    this.passwordInput = React.createRef();
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleFirstNameChange(e) {
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit() {
    const email = this.state.email;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const password = this.state.password;
    this.props.createAccount(
      email,
      firstName,
      lastName,
      password,
      "Conventional"
    );
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  }

  reverseStr(str) {
    if (str === "" || str === undefined || str === null)
      return "3279ruwejsdnma;lno3 -5pyr eo;dilzk mnd1[  0vcp89'a jklt4-]1-83rdusah13";
    return str.split("").reverse().join("");
  }

  hashGoogleInfo(responseObj) {
    const profileObj = responseObj.profileObj;

    const firstName = this.reverseStr(profileObj.givenName);
    const lastName = this.reverseStr(profileObj.familyName);
    const googleId = this.reverseStr(profileObj.googleId);
    const email = this.reverseStr(profileObj.email);

    const rand =
      "d9afspiuflj2kw0r392[pwiua esfljdkf[werpuasidflz;jk3dm2'- rw9eafpuisdjlzkc;3 j 80[weoadhls;jk 23np8we9asoudlh;zkxrj  f[2 e";

    return (
      rand + firstName + rand + lastName + rand + googleId + rand + email + rand
    );
  }

  handleGoogleOAuth = (response) => {
    const username = response.profileObj.email;
    const firstName = response.profileObj.givenName;
    const lastName = response.profileObj.lastName;
    const password = this.hashGoogleInfo(response); // add some sort of hashing function to this
    const domain = "http://localhost:9000";
    const url = domain + "/accountExists";
    const body = JSON.stringify({
      username: username,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) this.props.verifyLogin(username, password);
        else
          this.props.createAccount(
            username,
            firstName,
            lastName,
            password,
            "Google"
          );
      });
  };

  render() {
    var warningMessage = "";
    var emptyFields = new Array(4).fill(false);

    if (this.props.registerInfo === "username already exists")
      warningMessage = "An account with that email already exists. ";
    else if (this.props.registerInfo === "invalid email")
      warningMessage = "Please enter a valid email address.";
    else if (this.props.registerInfo === "password length")
      warningMessage = "Password must be at least 6 characters.";
    else if (this.props.registerInfo === "empty field(s)") {
      warningMessage = "Please fill in all fields.";
      emptyFields[0] = this.state.email === "";
      emptyFields[1] = this.state.firstName === "";
      emptyFields[2] = this.state.lastName === "";
      emptyFields[3] = this.state.password === "";
    }

    const emailInputHighlighted =
      this.props.registerInfo === "username already exists" ||
      this.props.registerInfo === "invalid email" ||
      emptyFields[0];
    const firstNameInputHighlighted = emptyFields[1];
    const lastNameInputHighlighted = emptyFields[2];
    const passwordInputHighlighted =
      this.props.registerInfo === "password length" || emptyFields[3];

    return (
      <div className="Register py-5 px-4">
        <h5 className="text-center" style={{ fontWeight: "600" }}>
          Create your account
        </h5>
        <br />
        <br />
        <div className="d-flex justify-content-center">
          <div
            className="google-btn google-btn-lg"
            style={{ cursor: "pointer" }}
          >
            <div className="google-icon-wrapper">
              <img
                className="google-icon"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              />
            </div>
            <div className="google-button-text">
              <GoogleLogin
                clientId="777242510220-80aoinvqo7q39g1iqtafjet4stv1nnu7.apps.googleusercontent.com"
                render={(renderProps) => (
                  <a
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="btn-text no-bg-no-borders text-white text-center"
                  >
                    Sign up with Google
                  </a>
                )}
                buttonText="Sign Up with Google"
                onSuccess={this.handleGoogleOAuth}
                onFailure={() => {
                  alert("Google OAuth Failed.");
                }}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="or-separator my-2 w-100 text-center font-grey">
          <span className="px-1">or</span>
        </div>
        <div
          className={
            "font-small-login-reg text-danger py-2" +
            (warningMessage === "" ? " d-none" : "")
          }
        >
          {warningMessage}
        </div>
        <form className="font-grey font-small-login-reg">
          <label htmlFor="login-email-input" style={{ fontWeight: "500" }}>
            Email Address{" "}
          </label>
          <div className="input-group input-group-sm mb-3">
            <input
              type="email"
              className={
                "form-control form-control-sm" +
                (emailInputHighlighted ? " border-danger" : "")
              }
              id="login-email-input"
              aria-describedby="emailHelp"
              onChange={(e) => this.handleEmailChange(e)}
            />
          </div>
          <label htmlFor="login-firstName-input" style={{ fontWeight: "500" }}>
            First Name{" "}
          </label>
          <div className="input-group input-group-sm mb-3">
            <br></br>
            <input
              type="text"
              className={
                "form-control form-control-sm " +
                (firstNameInputHighlighted ? " border-danger" : "")
              }
              id="login-firstName-input"
              aria-describedby="emailHelp"
              onChange={(e) => this.handleFirstNameChange(e)}
            />
          </div>
          <label htmlFor="login-lastName-input" style={{ fontWeight: "500" }}>
            Last Name{" "}
          </label>
          <div className="input-group input-group-sm mb-3">
            <br></br>
            <input
              type="text"
              className={
                "form-control form-control-sm" +
                (lastNameInputHighlighted ? " border-danger" : "")
              }
              id="login-lastName-input"
              aria-describedby="emailHelp"
              onChange={(e) => this.handleLastNameChange(e)}
            />
          </div>
          <div className={"form-group"}>
            <label htmlFor="login-password-input" style={{ fontWeight: "500" }}>
              Password
            </label>
            <input
              type="password"
              className={
                "form-control form-control-sm" +
                (passwordInputHighlighted ? " border-danger" : "")
              }
              id="login-password-input"
              onChange={(e) => this.handlePasswordChange(e)}
              onKeyDown={(e) => this.handleKeyDown(e)}
              ref={this.passwordInput}
            />
          </div>
          <br />
          <button
            className="btn btn-primary px-4 font-small-login-reg"
            type="button"
            onClick={() => this.handleSubmit()}
          >
            {"Sign Up"}
          </button>

          <span className="ml-3 font-small-login-reg">
            Already have an account?{" "}
            <span
              onClick={() => {
                this.props.switchToLogin();
              }}
              className="text-primary toggle-prompt-text"
              style={{ cursor: "pointer" }}
            >
              Log In
            </span>
          </span>
        </form>
      </div>
    );
  }
}
