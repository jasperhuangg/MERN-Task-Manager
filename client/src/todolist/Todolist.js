import React, { Component } from "react";
import Details from "./Details.js";
import ListItem from "./ListItem.js";
import CalendarOverlay from "./CalendarOverlay.js";
import PrioritiesOverlay from "./PrioritiesOverlay.js";

import "./Todolist.css";
import DateParser from "./DateParser.js";

const domain = "http://localhost:9000";

export default class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarOverlayDisplaying: false,
      prioritiesOverlayDisplaying: false,
      addItemValue: "",
      addItemDate: "",
      addItemPriority: "medium",
      listItems: this.props.items,
      addItemDateKeywords: "",
    };
  }

  keyPress(e) {
    var val = document.getElementById("addItemInput").value;
    val = removeOccurence(val, this.state.addItemDateKeywords);
    val = removeExtraWhitespace(val);

    // hardcoded date and priority values as UI components not yet implemented
    if (e.keyCode === 13 && val !== "") {
      console.log(val);
      this.props.addListItem(
        this.props.name,
        val,
        this.state.addItemDate,
        "",
        this.state.addItemPriority
      );
      document.getElementById("addItemInput").value = "";
      this.handleCalendarOverlayOK();
      this.setState({
        addItemDate: "",
        addItemValue: "",
        addItemDateKeywords: "",
        addItemPriority: "medium",
      });
    }
  }

  handleInput(e) {
    this.setState({ addItemValue: e.target.value });

    var parsedDate = DateParser(e.target.value).date;
    var keywords = DateParser(e.target.value).keywords;

    if (parsedDate !== "") {
      this.setState({
        addItemDate: parsedDate,
        addItemDateKeywords: keywords,
      });
    }
  }

  setAddItemDate(date) {
    this.setState({ addItemDate: date });
  }

  handleCalendarOverlayOK() {
    this.setState({ calendarOverlayDisplaying: false });
  }

  handleShowCalendarOverlay() {
    if (this.state.calendarOverlayDisplaying)
      this.setState({ calendarOverlayDisplaying: false });
    else this.setState({ calendarOverlayDisplaying: true });
  }

  handleShowPrioritiesOverlay() {
    if (this.state.prioritiesOverlayDisplaying)
      this.setState({ prioritiesOverlayDisplaying: false });
    else this.setState({ prioritiesOverlayDisplaying: true });
  }

  handlePrioritiesOverlayClick(priority) {
    this.setState({
      addItemPriority: priority,
      prioritiesOverlayDisplaying: false,
    });
  }

  render() {
    const name = this.props.name;
    const items = this.props.items;
    const color = this.props.color;
    const calendarOverlayClasslist = this.state.calendarOverlayDisplaying
      ? ""
      : "d-none";
    const prioritiesOverlayClasslist = this.state.prioritiesOverlayDisplaying
      ? ""
      : "d-none";
    const dueDateFormatted = formatDate(this.state.addItemDate);

    const placeholder =
      'Add a task to "' +
      name +
      '"' +
      (dueDateFormatted === "" ? "" : " on " + dueDateFormatted);

    return (
      // w-50 class is temporary
      <div className="container-fluid w-50">
        <h1 className="text-right my-4">{name}</h1>
        <div className="input-group mb-4">
          <input
            id="addItemInput"
            className="form-control"
            type="text"
            placeholder={placeholder}
            onInput={(e) => this.handleInput(e)}
            onKeyDown={(e) => this.keyPress(e)}
          />
          <div
            className="input-group-append"
            onClick={() => this.handleShowPrioritiesOverlay()}
          >
            <span className="input-group-text icon">
              <i className="fas fa-balance-scale-left"></i>
            </span>
          </div>
          <div className={prioritiesOverlayClasslist}>
            <PrioritiesOverlay
              handlePrioritiesOverlayClick={(priority) =>
                this.handlePrioritiesOverlayClick(priority)
              }
            />
          </div>
          <div
            className="input-group-append"
            onClick={() => this.handleShowCalendarOverlay()}
          >
            <span className="input-group-text icon">
              <i className="fas fa-calendar-alt"></i>
            </span>
          </div>
        </div>
        <div className={calendarOverlayClasslist}>
          <CalendarOverlay
            setAddItemDate={(date) => this.setAddItemDate(date)}
            handleCalendarOverlayOK={() => this.handleCalendarOverlayOK()}
          />
        </div>
        {items.map((item, i) => (
          <div className="list-item" key={item.itemID}>
            <ListItem
              listName={name}
              title={item.title}
              description={item.description}
              priority={item.priority}
              dueDate={item.dueDate}
              completed={item.completed}
              itemID={item.itemID}
              setItemCompleted={(listName, itemID, completed) =>
                this.props.setItemCompleted(listName, itemID, completed)
              }
              setItemTitle={(listName, itemID, title) =>
                this.props.setItemTitle(listName, itemID, title)
              }
            />
          </div>
        ))}
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

// toRemove is all lowercase letters, str could have uppercase letters
function removeOccurence(str, toRemove) {
  console.log("toRemove: " + toRemove);
  if (toRemove === "") return str;
  var lowerCase = str.toLowerCase();
  var startIndex = lowerCase.indexOf(toRemove);
  var endIndex = startIndex + toRemove.length;

  var res = str.substring(0, startIndex) + str.substring(endIndex, str.length);

  return res;
}

function removeExtraWhitespace(str) {
  str = str.replace(/\s+/g, " ");
  str = str.trim();

  return str;
}
