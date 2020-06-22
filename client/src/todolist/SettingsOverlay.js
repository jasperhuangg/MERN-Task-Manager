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
        <input style={{ width: 0, opacity: 0 }} ref={this.props.settingsRef} />
        {/* <label htmlFor="settings-bg-select">Background</label> */}

        <label>Priority/Date Setting with Keywords</label>
        <div class="form-group">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="keywords-radio"
              id="keywords-radio-1"
              value="option1"
              checked
            />
            <label class="form-check-label" for="keywords-radio-1">
              Enabled
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="keywords-radio"
              id="keywords-radio-2"
              value="option2"
            />
            <label class="form-check-label" for="keywords-radio-2">
              Disabled
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>Sorting</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="sorting-radio"
              id="sorting-radio-1"
              value="option1"
              checked
            />
            <label class="form-check-label" for="sorting-radio-1">
              Dates first
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="exampleRadios"
              name="sorting-radio"
              id="sorting-radio-2"
              value="option2"
            />
            <label class="form-check-label" for="sorting-radio-2">
              Priorities first
            </label>
          </div>
        </div>

        {/* <label htmlFor="add-list-title-input">Item Sorting</label> */}
      </div>
    );
  }
}
