import React, { Component } from "react";

import "./Todolist.css";

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      itemID: this.props.selectedItemID,
      title: this.props.selectedItemTitle,
      dueDate: this.props.selectedItemDueDate,
      priority: this.props.selectedItemPriority,
      description: this.props.selectedItemDescription,
      completed: this.props.selectedItemCompleted,
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleBlur = (e) => {
    const title = e.target.value;
    if (title !== this.props.selectedItemTitle)
      this.props.setItemTitle(
        this.props.listName,
        this.props.selectedItemID,
        title
      );
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.inputRef.current.blur();
    }
  };

  componentDidUpdate(prevProp) {
    if (
      prevProp.selectedItemTitle === this.props.selectedItemTitle &&
      prevProp.selectedItemDueDate === this.props.selectedItemDueDate &&
      prevProp.selectedItemCompleted === this.props.selectedItemCompleted &&
      prevProp.selectedItemDescription === this.props.selectedItemDescription &&
      prevProp.selectedItemPriority === this.props.selectedItemPriority &&
      prevProp.selectedItemID === this.props.selectedItemID
    )
      return;
    this.setState({
      title: this.props.selectedItemTitle,
      dueDate: this.props.selectedItemDueDate,
      completed: this.props.selectedItemCompleted,
      description: this.props.selectedItemDescription,
      priority: this.props.selectedItemPriority,
      itemID: this.props.selectedItemID,
    });
  }

  handleCheck(e) {
    var completed = e.target.checked;

    this.props.setItemCompleted(
      this.props.listName,
      this.state.itemID,
      completed
    );
  }

  render() {
    var priorityPickerClasses = "col-1 details-priority-picker";
    if (this.state.priority === "high") priorityPickerClasses += " text-danger";
    else if (this.state.priority === "medium")
      priorityPickerClasses += " text-primary";
    else if (this.state.priority === "low")
      priorityPickerClasses += " text-info";

    return (
      <React.Fragment>
        <div className={this.state.itemID === "" ? "d-none" : ""}>
          <div
            id="details-top-row"
            className="row align-items-center mt-4 pb-3 justify-content-around mb-4"
          >
            <div className="col-1 details-top-row-check d-flex justify-content-center">
              <input
                className="mx-auto"
                type="checkbox"
                value=""
                checked={this.state.completed}
                onChange={this.handleCheck}
              />
            </div>
            <div
              className={
                "details-date-picker col-3" +
                (getIsLate(this.state.dueDate)
                  ? " text-danger"
                  : this.state.dueDate === ""
                  ? ""
                  : " text-primary")
              }
              // onClick={
              //   // show details calendar overlay
              // }
            >
              <span className="mr-2">
                <i className="fas fa-calendar-alt"></i>
              </span>
              {formatDate(this.state.dueDate)}
            </div>
            <div className="col-7"></div>
            <div className={priorityPickerClasses}>
              <i className="fas fa-balance-scale-left"></i>
            </div>
          </div>
          <div id="details-title-input-container" className="pb-2">
            <input
              spellCheck="false"
              className="details-title-input"
              placeholder="Title"
              value={this.state.title}
              onKeyDown={(e) => this.handleKeyPress(e)}
              onBlur={(e) => this.handleBlur(e)}
              ref={this.inputRef}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          <div id="details-desc-input-container" className="h-100">
            <textarea
              id="details-desc-input"
              value={this.state.description}
              placeholder="Description"
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
        </div>
        <div
          id="details-placeholder"
          className={
            "row h-100 align-items-center justify-content-center font-italic " +
            (this.state.itemID !== "" ? "d-none" : "")
          }
        >
          <div className="col-12 text-center my-auto">
            Click on an item to see it's details <br />
            <br />
            <i className="fas fa-tasks" style={{ fontSize: "20px" }}></i>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function formatDate(str) {
  if (str === "" || str === undefined) return "Due Date";
  const today = new Date();
  const currYear = today.getFullYear();

  const monthAbbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = parseInt(str.substring(0, 4));
  const month = parseInt(str.substring(5, 7));
  const day = parseInt(str.substring(8, 10));

  var dateObj = new Date(year + "-" + month + "-" + day + " 00:00");

  if (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth()
  ) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateObj.getDate() === today.getDate()) return "Today";
    else if (dateObj.getDate() === yesterday.getDate()) return "Yesterday";
    else if (dateObj.getDate() === tomorrow.getDate()) return "Tomorrow";
  }

  var formatted =
    monthAbbr[month - 1] + " " + day + (currYear === year ? "" : ", " + year);

  return formatted;
}
function getIsLate(date) {
  if (date === "" || date === undefined) return false;
  const today = new Date() - 1;
  const d = new Date(date + " 00:00");

  return d < today;
}
