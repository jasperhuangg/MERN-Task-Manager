import React, { Component } from "react";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.currentlySelectedListName,
    };
  }

  selectList(e) {
    var listName = e.currentTarget.getElementsByClassName(
      "sidebar-list-name"
    )[0].innerText;

    var id = e.currentTarget.id;

    if (listName.indexOf("\n") !== -1)
      listName = listName.substring(0, listName.indexOf("\n"));

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
      <div className="sidebar-container py-5">
        <div className="mb-4 pl-3">
          <span
            className="profile-icon"
            style={{
              color: "white",
              backgroundColor: "rgb(21, 127, 251)",
              borderRadius: "50%",
              padding: "10px",
              fontSize: "14px",
              pointerEvents: "none",
            }}
          >
            {this.props.firstName.toUpperCase()[0] +
              this.props.lastName.toUpperCase()[0]}
          </span>
        </div>
        <div
          id="sidebar-today"
          className={
            "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
            (selectedList === "Today" ? " selected-sidebar-item" : "")
          }
          style={{ borderTop: "0.25px solid rgb(187, 187, 187, 0.4)" }}
          onClick={(e) => this.selectList(e)}
        >
          <i className="fas fa-calendar-day sidebar-icon col-1 mr-1"></i>
          <div className="col-6 text-left p-0 sidebar-list-name">Today</div>
          <div className="col-4 font-small">
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
        >
          <i className="fas fa-calendar-week sidebar-icon col-1 mr-1"></i>
          <div className="col-6 text-left p-0 sidebar-list-name">
            Next 7 Days
          </div>
          <div className="col-4 font-small">
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
        >
          <i className="fas fa-calendar sidebar-icon col-1 mr-1"></i>
          <div className="col-6 text-left p-0 sidebar-list-name">All</div>
          <div className="col-4 font-small">
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
        {personalLists.map((list, index) => {
          const count = countIncompletedItems(list);
          return (
            <div
              key={list.name}
              className={
                "sidebar-item py-2 pl-4 .no-gutters row align-items-center justify-content-left" +
                (selectedList === list.name ? " selected-sidebar-item" : "")
              }
              onClick={(e) => this.selectList(e)}
            >
              <i className="fas fa-bars sidebar-icon col-1 mr-1"></i>
              <div className="col-6 text-left p-0 sidebar-list-name">
                {list.name}
              </div>
              <div className="col-4 font-small">{count > 0 ? count : ""}</div>
            </div>
          );
        })}
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
