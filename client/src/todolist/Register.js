import React, { Component } from "react";
import "./Login-Register.css";

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
    this.props.createAccount(email, firstName, lastName, password);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  }

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
        <h5 style={{ fontWeight: "600" }}>Create your account</h5>
        <br />
        <br />
        <div className="w-100 text-center">Sign up with Google</div>
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
