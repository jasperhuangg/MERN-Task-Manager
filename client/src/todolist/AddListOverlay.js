import React, { Component } from "react";

export default class AddListOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedColor: "", listName: "", issue: "" };
  }

  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    console.log(color);
    this.setState({ selectedColor: color });
    this.props.focusTitleInput();
  }

  handleSubmit() {
    console.log("triggered in addlistoverlay");
    const listName = this.state.listName;
    const color = this.state.selectedColor;

    if (listNameExists(this.props.lists, listName)) {
      this.setState({ issue: "List name already exists." });
    } else {
      // call create list function
      this.props.createList(listName, color);
      // close the overlay
      this.props.hideOverlay();
      this.setState({ selectedColor: "", listName: "", issue: "" });
    }
  }

  render() {
    var issueText = this.state.issue;

    const colors = [
      "#FDC5F5",
      "#861388",
      "#5E0B15",
      "#f76f90",
      "#e01e37",
      "#FFD166",
      "#fb5607",
      "#ffcdb2",
      "#8cb369",
      "#29BF12",
      "#06EFB1",
      "#0496FF",
      "#5390d9",
      "#023e7d",
      "#5448C8",
      "#131200",
      "#d9d9d9",
    ];

    const classes =
      "add-list-overlay shadow font-grey p-4" +
      (this.props.displaying ? " add-list-overlay-displayed" : "");
    return (
      <div
        className={classes}
        onKeyDown={(e) => {
          if (e.keyCode === 13) this.handleSubmit();
        }}
      >
        <div className="text-center" style={{ pointerEvents: "none" }}>
          <h5>Add List</h5>
        </div>
        <label htmlFor="add-list-title-input">Title</label>
        <input
          id="add-list-title-input"
          className="form-control form-control-sm"
          ref={this.props.addListTitleRef}
          onChange={(e) => {
            this.setState({
              listName: e.currentTarget.value,
              issue: "",
            });
          }}
        />
        <span className="text-right">
          <small
            className={
              "text-right text-danger" +
              (this.state.issue !== "" ? "" : " invisible")
            }
          >
            {issueText}
          </small>
        </span>
        <br />

        <label htmlFor="add-list-color-input">Color</label>

        <div className="d-flex justify-content-around">
          {colors.map((color, index) => {
            return (
              <i
                key={color}
                className={
                  "fa fa-circle add-list-overlay-color" +
                  (this.state.selectedColor === color
                    ? " add-list-overlay-color-selected"
                    : "")
                }
                style={{ color: color }}
                data-color={color}
                onClick={(e) => this.selectColor(e)}
              />
            );
          })}
        </div>
        <div className="d-flex justify-content-center mt-5 pb-2">
          <button
            className="btn btn-sm btn-secondary mr-2 px-3"
            style={{ borderRadius: "5px" }}
            onClick={() => {
              this.setState({
                selectedColor: "",
                listName: "",
                listNameExists: false,
              });
              this.props.hideOverlay();
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary ml-2 px-3"
            style={{ borderRadius: "5px" }}
            onClick={() => this.handleSubmit()}
            disabled={
              this.state.listName === "" || this.state.selectedColor === ""
            }
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

function listNameExists(lists, listName) {
  console.log(lists);
  for (let i = 0; i < lists.length; i++)
    if (lists[i].name === listName) return true;

  return false;
}
