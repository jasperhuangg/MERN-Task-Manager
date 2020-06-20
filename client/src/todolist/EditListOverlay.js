import React, { Component } from "react";

export default class EditListOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedColor: undefined,
      listName: undefined,
      issue: "",
    };
  }

  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    console.log(color);
    this.setState({ selectedColor: color });
    this.props.focusTitleInput();
  }

  handleSubmit() {
    const listName = this.state.listName;
    const color = this.state.selectedColor;

    if (!listNameExists(this.props.startingName, this.props.lists, listName)) {
      this.setState({ selectedColor: undefined, listName: undefined });

      this.props.editList(this.props.startingName, listName, color);

      // close the overlay
      this.props.hideOverlay();
    } else {
      this.setState({ issue: "List name already exists." });
    }
  }

  render() {
    var issueText = this.state.issue;
    if (
      (this.state.listName === undefined ||
        this.state.selectedColor === undefined) &&
      this.props.startingColor !== "" &&
      this.props.startingName !== ""
    ) {
      console.log("setting");
      this.setState({
        selectedColor: this.props.startingColor,
        listName: this.props.startingName,
      });
    }

    const colors = [
      "#FDC5F5",
      "#861388",
      "#80242f",
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
          if (
            e.keyCode === 13 &&
            this.state.listName !== "" &&
            this.state.selectedColor !== ""
          )
            this.handleSubmit();
        }}
      >
        <div className="text-center" style={{ pointerEvents: "none" }}>
          <h5>Edit List</h5>
        </div>
        <label htmlFor="add-list-title-input">Title</label>
        <input
          id="add-list-title-input"
          className="form-control form-control-sm"
          ref={this.props.editListTitleRef}
          onChange={(e) => {
            this.setState({
              listName: e.currentTarget.value,
              issue: "",
            });
          }}
          autoComplete="off"
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
            var shadedColor = shadeColor(color, -40) + "BB";
            return (
              <i
                key={color}
                className={
                  "fa fa-circle add-list-overlay-color" +
                  (this.state.selectedColor === color
                    ? " add-list-overlay-color-selected"
                    : "")
                }
                style={{
                  fontSize: "13px",
                  color: color,
                  borderColor:
                    this.state.selectedColor === color
                      ? shadedColor
                      : "rgba(0, 0, 0, 0)",
                  backgroundColor:
                    this.state.selectedColor === color
                      ? shadedColor
                      : "rgba(0, 0, 0, 0)",
                }}
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
                selectedColor: undefined,
                listName: undefined,
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

function listNameExists(originalName, lists, listName) {
  for (let i = 0; i < lists.length; i++)
    if (lists[i].name === listName && lists[i].name !== originalName)
      return true;

  return false;
}

function shadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}
