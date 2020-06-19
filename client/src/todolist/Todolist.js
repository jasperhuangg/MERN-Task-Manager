import React, { Component } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import $ from "jquery";

import ListItem from "./ListItem.js";
import CalendarOverlay from "./CalendarOverlay.js";
import PrioritiesOverlay from "./PrioritiesOverlay.js";
import DateParser from "./DateParser.js";

import "./Todolist.css";

export default class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarOverlayDisplaying: false,
      prioritiesOverlayDisplaying: false,
      addItemValue: "",
      addItemDate: "",
      addItemPriority: "low",
      listItems: this.props.items,
      addItemDateKeywords: "",
      completedItemsShowing: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    $(document).ready(function () {
      $("#completed-items").hide();
    });
  }

  keyPress(e) {
    var val = document.getElementById("addItemInput").value;
    if (this.state.addItemDate !== "")
      val = removeOccurence(val, this.state.addItemDateKeywords);
    val = removeExtraWhitespace(val);

    // hardcoded date and priority values as UI components not yet implemented
    if (e.keyCode === 13 && val !== "") {
      this.props.addListItem(
        this.props.name,
        val,
        this.state.addItemDate,
        "",
        this.state.addItemPriority
      );
      $("#addItemInput").val("");
      this.handleCalendarOverlayOK();
      this.setState({
        addItemDate: "",
        addItemValue: "",
        addItemDateKeywords: "",
        addItemPriority: "low",
        keywordSet: false,
      });
      $(document).find(".add-item-input-container").show();
      var backspaceEvent = $.Event("keyDown");
      backspaceEvent.which = 8; // # Some key code value
      $("#addItemInput").trigger(backspaceEvent);
    }
  }

  handleInput(e) {
    var dateParserObj = DateParser(e.target.value);
    var parsedDate = dateParserObj.date;
    var keywords = dateParserObj.keywords;

    if (
      keywords === "" &&
      this.state.addItemDateKeywords !== "" &&
      e.target.value.indexOf(this.state.addItemDateKeywords) !== -1
    ) {
      parsedDate = this.state.addItemDate;
      keywords = this.state.addItemDateKeywords;
    }

    this.setState({
      addItemValue: e.target.value,
      addItemDate: parsedDate,
      addItemDateKeywords: keywords,
    });
  }

  setAddItemDate(date) {
    this.setState({ addItemDate: date });
  }

  handleDelete(id) {
    this.props.deleteListItem(this.props.name, id);
  }

  handleCalendarOverlayOK() {
    this.setState({ calendarOverlayDisplaying: false });
  }

  handleCalendarOverlayClear() {
    this.setState({
      calendarOverlayDisplaying: false,
      addItemDate: "",
    });
  }

  handleShowCalendarOverlay(e) {
    const xCoord = (e.clientX * 7) / 12;
    $(".calendar-overlay").css("left", xCoord + "px");
    if (this.state.calendarOverlayDisplaying)
      this.setState({ calendarOverlayDisplaying: false });
    else this.setState({ calendarOverlayDisplaying: true });
  }

  handleShowPrioritiesOverlay(e) {
    const xCoord = (e.clientX * 7) / 12;
    $(".priorities-overlay").css("left", xCoord + "px");
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

  getIndexOfFirstCompletedItem() {
    const items = this.props.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].completed) return i;
    }

    return -1;
  }

  getPriorityIconClasses() {
    var classes = "fas fa-balance-scale-left";
    if (this.state.addItemPriority === "high") {
      classes += " text-danger";
    } else if (this.state.addItemPriority === "medium") {
      classes += " text-warning";
    } else if (this.state.addItemPriority === "low") {
      classes += " text-primary";
    }

    return classes;
  }

  handleCloseOverlays(e) {
    if (
      this.state.calendarOverlayDisplaying ||
      this.state.prioritiesOverlayDisplaying
    ) {
      if (
        e.target.id !== "calendar-overlay" &&
        e.target.id !== "priorities-overlay"
      )
        this.setState({
          calendarOverlayDisplaying: false,
          prioritiesOverlayDisplaying: false,
        });
      else if (e.target.id === "calendar-overlay")
        this.setState({
          prioritiesOverlayDisplaying: false,
        });
      else if (e.target.id === "priorities-overlay")
        this.setState({
          calendarOverlayDisplaying: false,
        });
      this.inputRef.current.focus();
    }
  }

  getCalendarIconClasses() {
    var classes = "fas fa-calendar-alt calendar-base";
    if (this.state.addItemDate !== "") classes += " calendar-selected";

    return classes;
  }

  handleCompletedSeparatorClick() {
    this.setState({ completedItemsShowing: !this.state.completedItemsShowing });
    $(document).find("#completed-items").slideToggle("fast");
  }

  render() {
    // important variables used for render setup
    var name = this.props.name;
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
    var addItemText = this.state.addItemValue;

    // classes used for rendering the icons used for accessing the calendar/priority overlays
    const priorityIconClasses = this.getPriorityIconClasses();
    const calendarIconClasses = this.getCalendarIconClasses();

    var emptyListText = "";
    var emptyListIcon = "fas fa-plus-square mr-2";

    if (name === "Today") {
      emptyListText = "Nothing due today, let's get ahead!";
      emptyListIcon = "fas fa-exclamation-circle mr-2";
    } else if (name === "All") {
      emptyListText = "Nothing due, kick back and relax.";
      emptyListIcon = "fas fa-exclamation-circle mr-2";
    } else if (name === "Next 7 Days") {
      emptyListText = "Nothing due in the next week, let's get ahead!";
      emptyListIcon = "fas fa-exclamation-circle mr-2";
    } else {
      emptyListText = "Add an item above";
      emptyListIcon = "fas fa-exclamation-circle mr-2";
    }

    // used so placeholder text stays in title input when it is focused but empty
    $(document).find(".add-item-input-container").show();

    // split the list items into two categories: incompleted items and completed items
    // supports functionality of hiding/showing completed items
    const firstCompletedIndex = this.getIndexOfFirstCompletedItem();
    var incompletedItems = [];
    var completedItems = [];
    if (firstCompletedIndex !== -1) {
      incompletedItems = this.props.items.slice(0, firstCompletedIndex);
      completedItems = this.props.items.slice(
        firstCompletedIndex,
        this.props.items.length
      );
    } else {
      incompletedItems = this.props.items.slice();
      completedItems = [];
    }
    const completedSeparatorIconClasses =
      "fas fa-sort-down mr-2 base" +
      (this.state.completedItemsShowing ? "" : " icon-rotated");
    return (
      <div
        className="container-fluid todolist"
        onClick={(e) => this.handleCloseOverlays(e)}
      >
        <h3 className="list-name text-left pl-1 my-4">{name}</h3>
        <div className="add-item-input-container">
          <div className="input-group mb-4">
            <input
              spellCheck="false"
              suppressContentEditableWarning={true}
              id="addItemInput"
              placeholder={placeholder}
              className={
                "form-control form-control-sm text-left editable" +
                (name === "Today" || name === "Next 7 Days" || name === "All"
                  ? " d-none"
                  : "")
              }
              type="text"
              defaultValue={addItemText}
              onInput={(e) => this.handleInput(e)}
              onKeyDown={(e) => this.keyPress(e)}
              ref={this.inputRef}
              onClick={() => this.props.hideAddListOverlay()}
            ></input>
            <div
              className={
                "input-group-append" +
                (name === "Today" || name === "Next 7 Days" || name === "All"
                  ? " d-none"
                  : "")
              }
              onClick={(e) => {
                this.handleShowPrioritiesOverlay(e);
                this.props.hideAddListOverlay();
              }}
            >
              <span className="input-group-text icon">
                <i className={priorityIconClasses}></i>
              </span>
            </div>
            <div id="priorities-overlay" className={prioritiesOverlayClasslist}>
              <PrioritiesOverlay
                handlePrioritiesOverlayClick={(priority) =>
                  this.handlePrioritiesOverlayClick(priority)
                }
                currentlySelectedPriority={this.state.addItemPriority}
              />
            </div>
            <div
              className="input-group-append"
              onClick={(e) => {
                this.handleShowCalendarOverlay(e);
                this.props.hideAddListOverlay();
              }}
            >
              <span
                className={
                  "input-group-text icon" +
                  (name === "Today" || name === "Next 7 Days" || name === "All"
                    ? " d-none"
                    : "")
                }
              >
                <i className={calendarIconClasses}></i>
              </span>
            </div>
          </div>
        </div>
        <div id="calendar-overlay" className={calendarOverlayClasslist}>
          <CalendarOverlay
            setDueDate={(date) => this.setAddItemDate(date)}
            handleCalendarOverlayOK={() => this.handleCalendarOverlayOK()}
            handleCalendarOverlayClear={() => this.handleCalendarOverlayClear()}
            currentlySelectedDate={this.state.addItemDate}
          />
        </div>
        <div className="todolist-items">
          <div id="incompleted-items">
            <span
              className={
                "pl-2 font-small font-grey " +
                (incompletedItems.length === 0 ? "" : "d-none")
              }
              style={{ pointerEvents: "none" }}
            >
              <i className={emptyListIcon}></i>
              {emptyListText}
            </span>
            {incompletedItems.map((item, i) => {
              return (
                <div className="list-item" key={item.itemID}>
                  <ContextMenuTrigger id={item.itemID}>
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
                      setSelectedItem={(itemID) =>
                        this.props.setSelectedItem(itemID)
                      }
                      selectedItemID={this.props.selectedItemID}
                      handleDelete={(id) => this.handleDelete(id)}
                    />
                  </ContextMenuTrigger>
                  <ContextMenu
                    id={item.itemID}
                    className="delete-menu px-2 py-1 shadow-sm"
                  >
                    <MenuItem
                      data={{ foo: "bar" }}
                      className="delete-menu-item px-1"
                      onClick={(id) => this.handleDelete(item.itemID)}
                    >
                      <div className="row align-items-center justify-content-left">
                        <i className="fas fa-trash col-1"></i>
                        <span className="col-6">Delete</span>
                      </div>
                    </MenuItem>
                  </ContextMenu>
                </div>
              );
            })}
          </div>
          <div
            style={{ cursor: "pointer" }}
            className={
              "completed-separator mt-2 mb-2 font-small text-left " +
              (completedItems.length === 0 ||
              name === "Today" ||
              name === "Next 7 Days" ||
              name === "All"
                ? "d-none"
                : "")
            }
            onClick={() => this.handleCompletedSeparatorClick()}
          >
            <i
              id="completed-separator-icon"
              className={completedSeparatorIconClasses}
            ></i>
            Completed
          </div>
          <div
            id="completed-items"
            className={
              name === "Today" || name === "Next 7 Days" || name === "All"
                ? "d-none"
                : ""
            }
          >
            {completedItems.map((item, i) => {
              return (
                <div className={"list-item"} key={item.itemID}>
                  <ContextMenuTrigger id={item.itemID}>
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
                      setSelectedItem={(itemID) =>
                        this.props.setSelectedItem(itemID)
                      }
                      selectedItemID={this.props.selectedItemID}
                      handleDelete={(id) => this.handleDelete(id)}
                    />
                  </ContextMenuTrigger>
                  <ContextMenu
                    id={item.itemID.toString()}
                    className="delete-menu px-2 py-1 shadow-sm"
                  >
                    <MenuItem
                      data={{ foo: "bar" }}
                      className="delete-menu-item px-1"
                      onClick={(id) => this.handleDelete(item.itemID)}
                    >
                      <div className="row align-items-center justify-content-left">
                        <i className="fas fa-trash col-1"></i>
                        <span className="col-6">Delete</span>
                      </div>
                    </MenuItem>
                  </ContextMenu>
                </div>
              );
            })}
          </div>
          <div
            id="bottom-line"
            className={
              "list-item" +
              (this.state.completedItemsShowing ||
              completedItems.length === 0 ||
              name === "Today" ||
              name === "All" ||
              name === "Next 7 Days"
                ? " d-none"
                : "")
            }
          ></div>
        </div>
      </div>
    );
  }
}

// takes in a string (e.g. '01-23-2020') and returns its equivalent 'Jan 23'
// omits year if year is the same as the current year
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

// removes the first occurence of toRemove in str, returns the modified version
function removeOccurence(str, toRemove) {
  if (toRemove === "") return str;
  var lowerCase = str.toLowerCase();
  var startIndex = lowerCase.indexOf(toRemove);
  var endIndex = startIndex + toRemove.length;

  var res = str.substring(0, startIndex) + str.substring(endIndex, str.length);

  return res;
}

// removes any duplicate, leading, and trailing whitespaces in str
function removeExtraWhitespace(str) {
  str = str.replace(/\s+/g, " ");
  str = str.trim();

  return str;
}
