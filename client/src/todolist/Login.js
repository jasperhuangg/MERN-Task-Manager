import React, { Component } from "react";
import "./Login-Register.css";
import { GoogleLogin } from "react-google-login";
import "./GoogleButton.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      usernameEntered: false,
      nextClicked: false,
    };
    this.passwordInput = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.state.usernameEntered === false && this.state.email !== "")
      this.setState({ usernameEntered: true });
  }

  handleEmailInput(e) {
    var entered = e.target.value === "";

    this.setState({
      email: e.target.value,
      usernameEntered: !entered,
    });
  }

  handleEmailEnter(e) {
    if (this.state.usernameEntered && (e.keyCode === 13 || e.keyCode === 9)) {
      e.preventDefault();
      this.setState({ nextClicked: true });
      this.passwordInput.current.focus();
    }
  }

  handlePasswordEnter(e) {
    if (this.state.nextClicked && e.keyCode === 13 && e.target.value !== "") {
      e.preventDefault();
      this.props.verifyLogin(
        this.state.email,
        this.state.password,
        "Conventional"
      );
      // this.setState({ usernameEntered: false, nextClicked: false });
    }
  }

  handlePasswordInput(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleLoginBtnClick(e) {
    e.preventDefault();
    if (!this.state.nextClicked) this.setState({ nextClicked: true });
    else {
      this.props.verifyLogin(
        this.state.email,
        this.state.password,
        "Conventional"
      );
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

    const rand1 =
      "d9afspiuflj2kw0r392[pwiua esfljdkf[werpuasidflz;jk3dm2'- rw9eafpuisdjlzkc;3 j 80[weoadhls;jk 23np8we9asoudlh;zkxrj  f[2 e";
    const rand2 =
      "483ruoeifdsjlvsgrhw4q5983;rlfkjDSGN,FDGHWB0YQ934TP8weio;gljgkhwtr07qy480rwuepjGKHRJIUWY5-03[94APW'OE;JTSKGNJWNLP8Q4029W";
    const rand3 =
      "0283ROWIELFKDSK[p9 peua4oliwfjkdsfhdiouaotil;fewtq0uogprijsldhuoijao'ortk4ripfdhig;fk';wple-9stdpygihpfj'kQ";
    const rand4 =
      "948otwrjafj408w[8aer9pifsdjqp49w;'etoisfaj49w0ep[orsiaj[w9eosdilhva5a049P;TJRpiJ0IO_*)OIPLYT(H08pytoi4ljwef";
    const rand5 =
      "30rweisdjfak]Oi;gjanljrL;J;u;OFTYITF8d35q54tr1q2t4awregfghoikhliop'o=]iioufdrye5a243twretriot89y8upo'p[]pjuyb9tvrdw4teqrwteyrty0jpo";

    return (
      rand1 +
      firstName +
      rand2 +
      lastName +
      rand3 +
      googleId +
      rand4 +
      email +
      rand5
    );
  }

  handleGoogleOAuth = (response) => {
    const username = response.profileObj.email;
    const firstName = response.profileObj.givenName;
    const lastName = response.profileObj.lastName;
    const password = this.hashGoogleInfo(response);
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
        if (res) this.props.verifyLogin(username, password, "Google");
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
    const sentBack = this.props.loginInfo !== "not yet";

    if (this.state.nextClicked && !sentBack) {
      this.passwordInput.current.focus();
    }

    return (
      <div className="Login py-5 px-4">
        <h1>LOGO</h1>
        <br />
        <br />
        <h5 className="text-left" style={{ fontWeight: "600" }}>
          Log in to your account
        </h5>
        <br />
        <div className="d-flex justify-content-center">
          <div className="google-btn" style={{ cursor: "pointer" }}>
            <div className="google-icon-wrapper">
              <img
                className="google-icon"
                alt=""
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
                    Log in with Google
                  </a>
                )}
                buttonText="Log in with Google"
                onSuccess={this.handleGoogleOAuth}
                onFailure={(response) => {
                  alert("Google OAuth Failed.\n" + JSON.stringify(response));
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
            "font-small-login-reg text-danger" +
            (this.props.loginInfo === "not yet" ? " d-none" : "")
          }
        >
          {this.props.loginInfo === "auth type"
            ? "Please log in using the method you created your account."
            : "Please provide a valid username and password."}
        </div>
        <br />
        <form className="font-grey font-small-login-reg">
          <label htmlFor="login-email-input" style={{ fontWeight: "500" }}>
            Email Address{" "}
          </label>
          <div className="input-group input-group-sm">
            <input
              type="email"
              className={
                "form-control form-control-sm" +
                (this.state.usernameEntered ? " input-validated" : "") +
                (sentBack && this.props.loginInfo === "username does not exist"
                  ? " border-danger"
                  : "")
              }
              id="login-email-input"
              aria-describedby="emailHelp"
              onChange={(e) => this.handleEmailInput(e)}
              onKeyDown={(e) => this.handleEmailEnter(e)}
              disabled={
                this.state.nextClicked &&
                this.props.loginInfo !== "username does not exist"
              }
              ref={this.inputRef}
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
              onChange={(e) => this.handlePasswordInput(e)}
              ref={this.passwordInput}
            />
          </div>
          <br />
          <br />

          <button
            className="btn btn-primary px-4 font-small-login-reg"
            type={this.state.nextClicked ? "submit" : "button"}
            disabled={
              !this.state.usernameEntered || this.inputRef.current.value === ""
            }
            onClick={(e) => this.handleLoginBtnClick(e)}
          >
            {this.state.nextClicked ? "Log In" : "Next"}
          </button>

          <span className="ml-3 font-small-login-reg">
            Don't have an account?{" "}
            <span
              onClick={() => {
                this.props.switchToRegister();
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
