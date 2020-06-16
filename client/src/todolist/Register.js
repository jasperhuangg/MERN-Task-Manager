import React, { Component } from "react";
import "./Login-Register.css";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault(); // prevent it from reloading the page

    // make a call to the DB in App.js to create the account
  }
  render() {
    return (
      <div className="Register py-5 px-4">
        <h1>LOGO</h1>
        <br />
        <br />
        <h3>Create your account</h3>
        <br />
        Sign up with Google
        <br />
        ----- or-----
        <br />
        Email address (i) <br />
        [this is your email address you used when you registered]
        <br />
        First Name
        <br />
        Last Name
        <br />
        Password
        <br />
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <button className="btn btn-primary px-4" type="submit">
            Log In
          </button>
          <span className="ml-5">
            Have an account?{" "}
            <span
              onClick={() => {
                this.props.switchToLogin();
              }}
              className="text-primary"
              style={{ cursor: "pointer" }}
            >
              Log in now
            </span>
          </span>
        </form>
      </div>
    );
  }
}
