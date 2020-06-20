import React, { Component } from "react";

import "./Todolist.css";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      itemID: props.itemID,
      title: this.props.title,
      dueDate: this.props.dueDate,
      completed: this.props.completed,
      priority: this.props.priority,
      pressedKeys: {},
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

  handleItemSelection(e) {
    this.props.setSelectedItem(this.state.itemID);
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.inputRef.current.blur();
    }
  };

  handleCmdDelete(e) {
    var map = this.state.pressedKeys;

    if (e.keyCode === 91 && map[8]) {
      map[e.keyCode] = e.type === "keydown";
      map[8] = false;
    } else if (e.keyCode === 91 && !map[8]) {
      map[e.keyCode] = e.type === "keydown";
    } else if (e.keyCode === 8 && map[91] === true) {
      this.props.handleDelete(this.state.itemID);
      map = {};
      this.setState({ pressedKeys: map });
    }
  }

  handleBlur = (e) => {
    const title = e.target.value;
    if (title !== this.props.title)
      this.props.setItemTitle(this.props.listName, this.state.itemID, title);
  };

  componentDidUpdate(prevProp) {
    if (
      prevProp.title === this.props.title &&
      prevProp.itemID === this.props.itemID &&
      prevProp.dueDate === this.props.dueDate &&
      prevProp.priority === this.props.priority &&
      prevProp.completed === this.props.completed
    )
      return;
    this.setState({
      title: this.props.title,
      itemID: this.props.itemID,
      dueDate: this.props.dueDate,
      priority: this.props.priority,
      completed: this.props.completed,
    });
  }

  render() {
    const title = this.state.title;
    const dueDate = this.state.dueDate;
    const completed = this.state.completed;
    const formattedDate = formatDate(dueDate);
    const isLate = getIsLate(dueDate);

    var dueDateClassList =
      "pr-2 col-2 text-right item-due-date font-small" +
      (isLate ? " text-danger" : "");

    const rowClasses =
      "row no-gutters justify-content-center pt-1 pb-1 pl-4 pr-1 align-items-center todo-item" +
      (this.state.completed ? " completed" : "") +
      (this.state.itemID === this.props.selectedItemID ? " selected-item" : "");

    const rowBorderColor = getRowBorderColor(this.state.priority);

    const titleInputClasses =
      "ml-2 form-control-sm title-input" +
      (this.state.itemID === this.props.selectedItemID
        ? " selected-item-input"
        : "");

    return (
      <div
        className={rowClasses}
        onClick={(e) => this.handleItemSelection(e)}
        onContextMenu={(e) => this.handleItemSelection(e)}
        style={{ borderColor: rowBorderColor }}
      >
        <div className="col-10 text-left align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            checked={completed}
            onChange={this.handleCheck}
          />
          <input
            spellCheck="false"
            className={titleInputClasses}
            value={title}
            ref={this.inputRef}
            onKeyDown={(e) => {
              this.handleKeyPress(e);
              this.handleCmdDelete(e);
            }}
            onBlur={(e) => this.handleBlur(e)}
            onChange={(e) => this.setState({ title: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className={dueDateClassList}>{formattedDate}</div>
      </div>
    );
  }
}

function formatDate(str) {
  if (str === "" || str === undefined || str === null) return "";
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
  if (date === "") return false;
  const today = new Date() - 1;
  const d = new Date(date + " 00:00");

  return d < today;
}

function getRowBorderColor(priority) {
  if (priority === "high") return "rgb(218, 56, 73)";
  else if (priority === "medium") return "rgb(254, 192, 47)";
  else if (priority === "low") return "rgb(21, 127, 251)";
}
