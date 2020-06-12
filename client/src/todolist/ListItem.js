import React, { Component } from "react";

import "./Todolist.css";
import "./Checkbox.css";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      itemID: props.itemID,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(e) {
    var completed = e.target.checked;

    this.props.setItemCompleted(
      this.props.listName,
      this.state.itemID,
      completed
    );
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.inputRef.current.blur();
    }
  };

  handleBlur = (e) => {
    const title = e.target.value;
    this.props.setItemTitle(this.props.listName, this.state.itemID, title);
  };

  render() {
    const title = this.props.title;
    const dueDate = this.props.dueDate;
    const completed = this.props.completed;
    const formattedDate = formatDate(dueDate);
    const isLate = getIsLate(dueDate);

    var dueDateClassList =
      "col-2 text-right item-due-date font-small" +
      (isLate ? " text-danger" : "");

    const rowClasses =
      "row justify-content-center pt-2 pb-2 pl-4 pr-1 align-items-center" +
      (this.props.completed ? " completed" : "");

    return (
      <div className={rowClasses}>
        <div className="col-10 text-left">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            checked={completed}
            onChange={this.handleCheck}
          />
          <input
            className="ml-2 item-title title-input"
            defaultValue={title}
            ref={this.inputRef}
            onKeyDown={(e) => this.handleKeyPress(e)}
            onBlur={(e) => this.handleBlur(e)}
          ></input>
          {/* <span className="ml-2 item-title">{title}</span> */}
        </div>

        <div className={dueDateClassList}>{formattedDate}</div>
      </div>
    );
  }
}

function formatDate(str) {
  if (str === "") return "";
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

  var formatted =
    monthAbbr[month - 1] + " " + day + (currYear === year ? "" : ", " + year);

  return formatted;
}

function getIsLate(date) {
  if (date === "") return false;
  const today = new Date();
  const d = new Date(date + " 00:00");

  return d < today;
}
