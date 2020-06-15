import React, { Component } from "react";
import ListItem from "./ListItem.js";
import CalendarOverlay from "./CalendarOverlay.js";
import PrioritiesOverlay from "./PrioritiesOverlay.js";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import $ from "jquery";

import "./Todolist.css";
import DateParser from "./DateParser.js";

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
      completedItemsShowing: false,
    };
  }

  componentDidMount() {
    $(document).ready(function () {
      $("#completed-items").hide();
    });
  }

  keyPress(e) {
    var val = document.getElementById("addItemInput").value;
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
        addItemPriority: "medium",
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

  getIndexOfFirstCompletedItem() {
    const items = this.state.listItems;

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
      classes += " text-primary";
    } else if (this.state.addItemPriority === "low") {
      classes += " text-info";
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
    var name = this.props.name;
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
    var addItemText = this.state.addItemValue;

    const priorityIconClasses = this.getPriorityIconClasses();
    const calendarIconClasses = this.getCalendarIconClasses();

    $(document).find(".add-item-input-container").show();

    const firstCompletedIndex = this.getIndexOfFirstCompletedItem();

    var incompletedItems = [];
    var completedItems = [];

    if (firstCompletedIndex !== -1) {
      incompletedItems = this.state.listItems.slice(0, firstCompletedIndex);
      completedItems = this.state.listItems.slice(
        firstCompletedIndex,
        this.state.listItems.length
      );
    } else {
      incompletedItems = this.state.listItems.slice();
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
        <h3 className="text-left my-4">{name}</h3>
        <div className="add-item-input-container">
          <div className="input-group mb-4">
            <input
              spellCheck="false"
              suppressContentEditableWarning={true}
              id="addItemInput"
              placeholder={placeholder}
              className="form-control text-left editable"
              type="text"
              defaultValue={addItemText}
              onInput={(e) => this.handleInput(e)}
              onKeyDown={(e) => this.keyPress(e)}
            ></input>
            <div
              className="input-group-append"
              onClick={() => this.handleShowPrioritiesOverlay()}
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
              onClick={() => this.handleShowCalendarOverlay()}
            >
              <span className="input-group-text icon">
                <i className={calendarIconClasses}></i>
              </span>
            </div>
          </div>
        </div>
        <div id="calendar-overlay" className={calendarOverlayClasslist}>
          <CalendarOverlay
            setAddItemDate={(date) => this.setAddItemDate(date)}
            handleCalendarOverlayOK={() => this.handleCalendarOverlayOK()}
            handleCalendarOverlayClear={() => this.handleCalendarOverlayClear()}
            currentlySelectedDate={this.state.addItemDate}
          />
        </div>
        <div className="todolist-items">
          <div id="incompleted-items">
            <span
              className={
                "pl-2 font-small font-italic " +
                (this.state.listItems.length === 0 ? "" : "d-none")
              }
            >
              Add an item above
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
                    className="delete-menu px-2 py-1"
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
              (completedItems.length === 0 ? "d-none" : "")
            }
            onClick={() => this.handleCompletedSeparatorClick()}
          >
            <i
              id="completed-separator-icon"
              className={completedSeparatorIconClasses}
            ></i>
            Completed
          </div>
          <div id="completed-items">
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
                    className="delete-menu px-2 py-1"
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
              "list-item" + (this.state.completedItemsShowing ? " d-none" : "")
            }
          ></div>
        </div>
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
