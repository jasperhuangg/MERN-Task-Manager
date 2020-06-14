import React, { Component } from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import ReactDOMServer from "react-dom/server";
import Details from "./Details.js";
import ListItem from "./ListItem.js";
import CalendarOverlay from "./CalendarOverlay.js";
import PrioritiesOverlay from "./PrioritiesOverlay.js";
import CaretPositioning from "./EditCaretPositioning.js";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import $ from "jquery";

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
      caretPosition: 0,
      lastCharInKeyword: -1,
    };
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
      var e = $.Event("keyDown");
      e.which = 8; // # Some key code value
      $("#addItemInput").trigger(e);
    }
  }

  handleInput(e) {
    if (
      e.keyCode === 8 &&
      this.state.caretPosition - 1 === this.state.lastCharInKeyword
    ) {
      console.log("unwrapping");
      $("#date-keyword").unwrap();
    }

    // if (
    //   this.state.addItemDateKeywords !== "" &&
    //   e.target.innerText.indexOf(this.state.addItemDateKeywords) !== -1
    // ) {
    //   const lastCharInKeyword =
    //     e.target.innerText.indexOf(this.state.addItemDateKeywords) +
    //     this.state.addItemDateKeywords.length -
    //     1;
    //   this.setState({ lastCharInKeyword: lastCharInKeyword });
    // }

    // let savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);

    var dateParserObj = DateParser(e.target.value);
    console.log("innerText: " + e.target.value);
    var parsedDate = dateParserObj.date;
    var keywords = dateParserObj.keywords;

    console.log("state: " + this.state.addItemDate);

    console.log("parsedDate: " + parsedDate);

    if (
      keywords === "" &&
      this.state.addItemDateKeywords !== "" &&
      e.target.value.indexOf(this.state.addItemDateKeywords) !== -1
    ) {
      parsedDate = this.state.addItemDate;
      keywords = this.state.addItemDateKeywords;
    }

    this.setState(
      {
        addItemValue: e.target.value,
        addItemDate: parsedDate,
        addItemDateKeywords: keywords,
        // caretPosition: savedCaretPosition,
      }
      // ,
      // () => {
      //   //restore caret position(s)
      //   CaretPositioning.restoreSelection(
      //     document.getElementById("addItemInput"),
      //     this.state.caretPosition
      //   );
      // }
    );
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

  formatDateKeywords(name, keyword) {
    console.log($("#addItemInput").children("span").length);

    // if there's already a keyword that is highlighted, short circuit
    if ($("#addItemInput").children("span").length > 0) {
      var res = <>{name}</>;
      return {
        formatted: res,
        lastCharInKeyword: 0,
      };
    }
    var startIndex = name.indexOf(keyword);
    var endIndex = startIndex + keyword.length;
    var res = (
      <>
        {name.substring(0, startIndex)}
        <span className="text-primary" id="date-keyword">
          {keyword}
        </span>
        {name.substring(endIndex, name.length)}
      </>
    );
    const lastCharInKeyword = endIndex - 1;

    return {
      formatted: res,
      lastCharInKeyword: lastCharInKeyword,
    };
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
    var classes = "fas fa-calendar-alt";
    if (this.state.addItemDate !== "") classes += " calendar-selected";
    console.log(this.state.addItemDate);
    console.log("classes: " + classes);

    return classes;
  }

  render() {
    var name = this.props.name;
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
    var addItemText = this.state.addItemValue;

    const priorityIconClasses = this.getPriorityIconClasses();
    const calendarIconClasses = this.getCalendarIconClasses();

    $(document).on("click", ".completed-separator", function () {
      // TODO: handle hiding completing items here
    });

    $(document).find(".add-item-input-container").show();

    const firstCompletedIndex = this.getIndexOfFirstCompletedItem();

    const incompletedItems = this.state.listItems.slice(0, firstCompletedIndex);
    const completedItems = this.state.listItems.slice(
      firstCompletedIndex,
      this.state.listItems.length
    );

    return (
      // w-50 class is temporary
      <div
        className="container-fluid w-50 todolist"
        onClick={(e) => this.handleCloseOverlays(e)}
      >
        <h1 className="text-left my-4">{name}</h1>
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
          />
        </div>
        <div className="todolist-items">
          <div id="incompleted-items">
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
                    />
                  </ContextMenuTrigger>
                  <ContextMenu
                    id={item.itemID.toString()}
                    className="delete-menu px-2 py-1"
                  >
                    <MenuItem
                      data={{ foo: "bar" }}
                      className="text-danger delete-menu-item px-2"
                      onClick={(id) => this.handleDelete(item.itemID)}
                    >
                      Delete
                    </MenuItem>
                  </ContextMenu>
                </div>
              );
            })}
          </div>
          <div className="completed-separator mt-2 mb-2 font-small text-left">
            <i className="fas fa-sort-down mr-2 "></i>
            Completed
          </div>
          <div id="completed-items">
            {completedItems.map((item, i) => {
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
                    />
                  </ContextMenuTrigger>
                  <ContextMenu
                    id={item.itemID.toString()}
                    className="delete-menu px-2 py-1"
                  >
                    <MenuItem
                      data={{ foo: "bar" }}
                      className="text-danger delete-menu-item px-2"
                      onClick={(id) => this.handleDelete(item.itemID)}
                    >
                      Delete
                    </MenuItem>
                  </ContextMenu>
                </div>
              );
            })}
          </div>

          {/* {items.map((item, i) => {
            if (i !== firstCompletedIndex) {
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
                    />
                  </ContextMenuTrigger>
                  <ContextMenu
                    id={item.itemID.toString()}
                    className="delete-menu px-2 py-1"
                  >
                    <MenuItem
                      data={{ foo: "bar" }}
                      className="text-danger delete-menu-item px-2"
                      onClick={(id) => this.handleDelete(item.itemID)}
                    >
                      Delete
                    </MenuItem>
                  </ContextMenu>
                </div>
              );
            } else {
              return (
                <React.Fragment key={item.itemID}>
                  <div className="list-item">
                    <div className="completed-separator mt-2 mb-2 font-small text-left">
                      <i className="fas fa-sort-down mr-2 "></i>
                      Completed
                    </div>
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
                          this.props.setItemCompleted(
                            listName,
                            itemID,
                            completed
                          )
                        }
                        setItemTitle={(listName, itemID, title) =>
                          this.props.setItemTitle(listName, itemID, title)
                        }
                      />
                    </ContextMenuTrigger>
                    <ContextMenu
                      id={item.itemID}
                      className="delete-menu px-2 py-1"
                    >
                      <MenuItem
                        data={{ foo: "bar" }}
                        className="text-danger delete-menu-item px-2"
                        onClick={(id) => this.handleDelete(item.itemID)}
                      >
                        Delete
                      </MenuItem>
                    </ContextMenu>
                  </div>
                </React.Fragment>
              );
            }
          })} */}
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
