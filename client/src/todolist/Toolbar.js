import React, { Component } from "react";

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
          <i className="fas fa-cogs"></i>
        </div>
        <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
          <i className="fas fa-hand-sparkles"></i>
        </div>
        <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
          <i className="fas fa-share-alt"></i>
        </div>
        <div
          className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center"
          onClick={() => this.props.handleLogOut()}
        >
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </>
    );
  }
}
