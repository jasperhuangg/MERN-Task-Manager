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
  }

  handleSubmit(e) {
    e.preventDefault(); // prevent it from reloading the page

    // make a call to the DB in App.js to create the account
  }
  render() {
    var sentBack = false;
    return (
      <div className="Register py-5 px-4">
        <h1>LOGO</h1>
        <br />
        <br />
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
            "font-small text-danger" +
            (this.props.loginInfo === "not yet" ? " d-none" : "")
          }
        >
          Please provide a valid username and password.
        </div>
        <br />
        <form className="font-grey font-small">
          <label htmlFor="login-email-input" style={{ fontWeight: "500" }}>
            Email Address{" "}
            {/* <i
              className="ml-1 info-icon fas fa-info-circle"
              // data-toggle="tooltip"
              // data-placement="right"
              // title="This is the email address you used when you signed up."
            ></i> */}
          </label>
          <div className="input-group input-group-sm">
            <input
              type="email"
              className={
                "form-control form-control-sm" +
                (sentBack && this.props.loginInfo === "username does not exist"
                  ? " border-danger"
                  : "")
              }
              id="login-email-input"
              aria-describedby="emailHelp"
              // onChange={(e) => this.handleEmailInput(e)}
              // onKeyDown={(e) => this.handleEmailEnter(e)}
              disabled={
                this.state.nextClicked &&
                this.props.loginInfo !== "username does not exist"
              }
            />
            <div
              className={
                "input-group-append" +
                (this.state.nextClicked &&
                this.props.loginInfo !== "username does not exist"
                  ? ""
                  : " d-none")
              }
            >
              <span className="input-group-text email-check">
                <i className="fas fa-check"></i>
              </span>
            </div>

            {/* <small id="emailHelp" className="form-text text-muted">
              This is your email address you used when you registered.
            </small> */}
          </div>

          <div
            className={"form-group" + (this.state.nextClicked ? "" : " d-none")}
          >
            <br></br>
            <label htmlFor="login-password-input" style={{ fontWeight: "500" }}>
              Password
            </label>
            <input
              type="password"
              className={
                "form-control form-control-sm" +
                (sentBack ? " border-danger" : "")
              }
              id="login-password-input"
              // onChange={(e) => this.handlePasswordInput(e)}
              ref={this.passwordInput}
            />
          </div>
          <br />
          <br />

          <button
            className="btn btn-primary px-4"
            type={this.state.nextClicked ? "submit" : "button"}
            disabled={!this.state.usernameEntered}
            onClick={(e) => this.handleLoginBtnClick(e)}
          >
            {this.state.nextClicked ? "Log In" : "Next"}
          </button>

          <span className="ml-3 font-small">
            Don't have an account?{" "}
            <span
              onClick={() => {
                this.props.switchToLogin();
              }}
              className="text-primary toggle-prompt-text"
              style={{ cursor: "pointer" }}
            >
              Sign Up
            </span>
          </span>
        </form>
      </div>
    );
  }
}
