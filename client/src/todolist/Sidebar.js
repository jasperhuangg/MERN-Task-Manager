import React, { Component } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.currentlySelectedListName,
    };
  }

  selectList(e) {
    var listName = e.currentTarget.dataset.listName;
    this.setState({ selectedList: listName });
    this.props.setSelectedList(listName);
  }

  render() {
    const selectedList = this.props.currentlySelectedListName;

    const personalLists = this.props.lists.slice(
      0,
      this.props.lists.length - 3
    );

    var incompletedCountToday = 0;
    var incompletedCountNext7Days = 0;
    var incompletedCountAll = 0;
    if (this.props.lists.length > 0) {
      incompletedCountToday = countIncompletedItems(
        this.props.lists[this.props.lists.length - 3]
      );
      incompletedCountNext7Days = countIncompletedItems(
        this.props.lists[this.props.lists.length - 2]
      );
      incompletedCountAll = countIncompletedItems(
        this.props.lists[this.props.lists.length - 1]
      );
    }

    return (
      <div className="sidebar-container pt-5">
        <div className="profile-icon mb-4 text-center">
          <span
            style={{
              color: "white",
              backgroundColor: "rgb(21, 127, 251)",
              borderRadius: "50%",
              padding: "10px",
              fontSize: "16px",
              pointerEvents: "none",
            }}
          >
            {(this.props.firstName === undefined ||
            this.props.firstName === null ||
            this.props.firstName === ""
              ? "?"
              : this.props.firstName.toUpperCase()[0]) +
              (this.props.lastName === undefined ||
              this.props.lastName === null ||
              this.props.lastName === ""
                ? "?"
                : this.props.lastName.toUpperCase()[0])}
          </span>
        </div>
        <div
          className="text-center font-small sidebar-item py-1 pt-3"
          style={{
            pointerEvents: "none",
            fontWeight: "600",
            color: "rgb(113, 123, 133)",
          }}
        >
          Smart Lists
        </div>
        <div
          id="sidebar-today"
          className={
            "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
            (selectedList === "Today" ? " selected-sidebar-item" : "")
          }
          data-list-name="Today"
          onClick={(e) => this.selectList(e)}
        >
          <i className="fas fa-calendar-day sidebar-icon col-1 mr-1"></i>
          <div className="col-5 text-left p-0 sidebar-list-name">Today</div>
          <div className="col-1 sidebar-list-color text-left invisible">
            <i className="fa fa-circle" style={{ fontSize: "8px" }}></i>
          </div>
          <div className="col-1 font-small">
            {incompletedCountToday > 0 ? incompletedCountToday : ""}
          </div>
        </div>
        <div
          id="sidebar-next-7-days"
          className={
            "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
            (selectedList === "Next 7 Days" ? " selected-sidebar-item" : "")
          }
          onClick={(e) => this.selectList(e)}
          data-list-name="Next 7 Days"
        >
          <i className="fas fa-calendar-week sidebar-icon col-1 mr-1"></i>
          <div className="col-5 text-left p-0 sidebar-list-name">
            Next 7 Days
          </div>
          <div className="col-1 sidebar-list-color text-left invisible">
            <i className="fa fa-circle" style={{ fontSize: "8px" }}></i>
          </div>
          <div className="col-1 font-small">
            {incompletedCountNext7Days > 0 ? incompletedCountNext7Days : ""}
          </div>
        </div>
        <div
          id="sidebar-all"
          className={
            "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
            (selectedList === "All" ? " selected-sidebar-item" : "")
          }
          onClick={(e) => this.selectList(e)}
          data-list-name="All"
        >
          <i className="fas fa-calendar sidebar-icon col-1 mr-1"></i>
          <div className="col-5 text-left p-0 sidebar-list-name">All</div>
          <div className="col-1 sidebar-list-color text-left invisible">
            <i className="fa fa-circle" style={{ fontSize: "8px" }}></i>
          </div>
          <div className="col-1 font-small">
            {incompletedCountAll > 0 ? incompletedCountAll : ""}
          </div>
        </div>
        <div
          className="text-center font-small sidebar-item py-1 pt-5"
          style={{
            pointerEvents: "none",
            fontWeight: "600",
            color: "rgb(113, 123, 133)",
          }}
        >
          Your Lists
        </div>
        <div id="personal-lists">
          {personalLists.map((list, index) => {
            const count = countIncompletedItems(list);
            const listName =
              list.name.length > 13
                ? list.name.substring(0, 12) + "..."
                : list.name;
            return (
              <div key={list.name}>
                <ContextMenuTrigger id={list.name}>
                  <div
                    className={
                      "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
                      (selectedList === list.name
                        ? " selected-sidebar-item"
                        : "")
                    }
                    onClick={(e) => this.selectList(e)}
                    data-list-name={list.name}
                  >
                    <i className="fas fa-bars sidebar-icon col-1 mr-1"></i>
                    <div className="col-5 text-left p-0 sidebar-list-name">
                      {listName}
                    </div>
                    <div className="col-1 sidebar-list-color text-left">
                      <i
                        className="fa fa-circle"
                        style={{ color: list.color, fontSize: "8px" }}
                      ></i>
                    </div>
                    <div className="col-1 font-small">
                      {count > 0 ? count : ""}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenu
                  id={list.name}
                  className="sidebar-context-menu p-0 shadow-sm"
                >
                  <MenuItem
                    data={{ listName: list.name }}
                    className="sidebar-context-menu-item px-2 py-1"
                    onClick={() =>
                      this.props.showEditListOverlay(list.name, list.color)
                    }
                  >
                    <div className="row align-items-center justify-content-left">
                      <i className="fas fa-edit col-1"></i>
                      <span className="col-6">Edit</span>
                    </div>
                  </MenuItem>
                  <MenuItem
                    data={{ listName: list.name }}
                    className="sidebar-context-menu-item px-2 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      const confirmed = window.confirm(
                        "Are you sure? \n\nDeleting this list will permanently delete all of its items."
                      );
                      if (confirmed) this.props.deleteList(list.name);
                    }}
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
          className="createListBtn text-center sidebar-icon sidebar-item py-2"
          style={{ borderBottom: "none" }}
          onClick={() => this.props.showAddListOverlay()}
        >
          <i className="fas fa-plus-circle" />
        </div>
      </div>
    );
  }
}

function countIncompletedItems(list) {
  const items = list.items;
  var res = 0;
  for (let i = 0; i < items.length; i++) {
    if (!items[i].completed) res++;
  }

  return res;
}
