import React, { Component } from "react";
import "./Login-Register.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault(); // prevent it from reloading the page

    this.props.verifyLogin("Jasper", "Jasper99!");
    // make a call to the DB in App.js to verify login info
  }
  render() {
    return (
      <div className="Login py-5 px-4">
        <h1>LOGO</h1>
        <br />
        <br />
        <h3>Log in to your account</h3>
        <br />
        Login with Google
        <br />
        ----- or-----
        <br />
        Email address (i) <br />
        [this is your email address you used when you registered]
        <br />
        <br />
        <br />
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <button className="btn btn-primary px-4" type="submit">
            Log In
          </button>
          <span className="ml-3">
            Don't have an account?{" "}
            <span
              onClick={() => {
                this.props.switchToRegister();
              }}
              className="text-primary"
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
