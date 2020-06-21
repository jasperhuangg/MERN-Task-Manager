import React, { Component } from "react";

export default class SettingsOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const classes =
      "settings-overlay shadow font-grey p-4" +
      (this.props.displaying ? " settings-overlay-displayed" : "");
    return (
      <div className={classes}>
        <div className="text-center" style={{ pointerEvents: "none" }}>
          <h5>Settings</h5>
        </div>
      </div>
    );
  }
}
