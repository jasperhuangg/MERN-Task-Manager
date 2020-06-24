import React, { Component } from "react";

export default class SettingsOverlay extends Component {
  constructor(props) {
    super(props);
  }

  setSorting(e) {
    const sortingType = e.currentTarget.dataset.type;
    this.props.setSortingSetting(sortingType);
  }

  setKeywords(e) {
    const keywordType = e.currentTarget.dataset.type;

    // both are checked, unchecking we are unchecking one of them
    if (this.props.keywords === "both") {
      if (keywordType === "dates") this.props.setKeywordsSetting("priorities");
      else if (keywordType === "priorities")
        this.props.setKeywordsSetting("dates");
    } else if (this.props.keywords === "none") {
      // nothing is checked atm, we are checking one of them
      if (keywordType === "dates") this.props.setKeywordsSetting("dates");
      else if (keywordType === "priorities")
        this.props.setKeywordsSetting("priorities");
    } else if (
      (this.props.keywords === "dates" && keywordType === "priorities") ||
      (this.props.keywords === "priorities" && keywordType === "dates")
    )
      // one is already checked and we are checking off the other
      this.props.setKeywordsSetting("both");
    else if (
      (this.props.keywords === "dates" && keywordType === "dates") ||
      (this.props.keywords === "priorities" && keywordType === "priorities")
    )
      // one is already checked and we are unchecking that one
      this.props.setKeywordsSetting("none");
  }

  render() {
    // checkbox setting
    const prioritiesKeywordsChecked =
      this.props.keywords === "both" || this.props.keywords === "priorities";
    const dateKeywordsChecked =
      this.props.keywords === "both" || this.props.keywords === "dates";

    // radio setting
    const prioritiesSortingChecked = this.props.sorting === "priorities first";
    const datesSortingChecked = this.props.sorting === "dates first";

    const classes =
      "settings-overlay shadow font-grey p-4" +
      (this.props.displaying ? " settings-overlay-displayed" : "");

    return (
      <div className={classes}>
        <div className="text-center" style={{ pointerEvents: "none" }}>
          <h5>Settings</h5>
        </div>
        <input style={{ width: 0, opacity: 0 }} ref={this.props.settingsRef} />

        <div>
          <label htmlFor="keyword-settings">
            Keyword Setting when Adding Items
          </label>
          <div id="keyword-settings" className="form-group">
            <div className="form-check ml-2">
              <input
                className="form-check-input settings-radio"
                type="checkbox"
                id="keywords-check-dates"
                data-type="dates"
                checked={dateKeywordsChecked}
                onClick={(e) => this.setKeywords(e)}
              />
              <label
                className="form-check-label settings-label"
                htmlFor="keywords-check-dates"
              >
                Dates
              </label>
            </div>
            <div className="form-check ml-2">
              <input
                className="form-check-input settings-radio"
                type="checkbox"
                id="keywords-check-priority"
                data-type="priorities"
                checked={prioritiesKeywordsChecked}
                onClick={(e) => this.setKeywords(e)}
              />
              <label
                className="form-check-label settings-label"
                htmlFor="keywords-check-priorities"
              >
                Priorities
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="sorting-settings">Item Sorting</label>
            <div id="sorting-settings" className="form-check ml-2">
              <input
                className="form-check-input settings-radio"
                type="radio"
                name="sorting-radio"
                id="sorting-radio-1"
                value="option1"
                data-type="dates first"
                checked={datesSortingChecked}
                onClick={(e) => this.setSorting(e)}
              />
              <label
                className="form-check-label settings-label"
                htmlFor="sorting-radio-1"
              >
                Dates First
              </label>
            </div>
            <div className="form-check ml-2">
              <input
                className="form-check-input settings-radio"
                type="radio"
                name="exampleRadios"
                name="sorting-radio"
                id="sorting-radio-2"
                value="option2"
                checked={prioritiesSortingChecked}
                data-type="priorities first"
                onClick={(e) => this.setSorting(e)}
              />
              <label
                className="form-check-label settings-label"
                htmlFor="sorting-radio-2"
              >
                Priorities First
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
