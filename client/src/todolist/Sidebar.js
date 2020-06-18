import React, { Component } from "react";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.currentlySelectedListName,
    };
  }

  selectList(e) {
    var listName = e.target.innerText;

    if (listName.indexOf("\n") !== -1)
      listName = listName.substring(0, listName.indexOf("\n"));

    this.setState({ selectedList: listName });
    this.props.setSelectedList(listName);
  }

  render() {
    const selectedList = this.props.currentlySelectedListName;
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
            }}
          >
            {this.props.firstName.toUpperCase()[0] +
              this.props.lastName.toUpperCase()[0]}
          </span>
        </div>
        <div
          className={
            "sidebar-item py-2 pl-5 row align-items-center" +
            (selectedList === "Today" ? " selected-sidebar-item" : "")
          }
          style={{ borderTop: "0.25px solid rgb(187, 187, 187, 0.4)" }}
          onClick={(e) => this.selectList(e)}
        >
          <i className="fas fa-calendar-day sidebar-icon"></i>Today
        </div>
        <div
          className={
            "sidebar-item py-2 pl-5 row align-items-center" +
            (selectedList === "Next 7 Days" ? " selected-sidebar-item" : "")
          }
          onClick={(e) => this.selectList(e)}
        >
          <i className="fas fa-calendar-week sidebar-icon"></i>Next 7 Days
        </div>
        <div
          className={
            "sidebar-item py-2 pl-5 row align-items-center" +
            (selectedList === "All" ? " selected-sidebar-item" : "")
          }
          onClick={(e) => this.selectList(e)}
        >
          <i className="fas fa-calendar sidebar-icon"></i>All
        </div>
        {this.props.lists.map((list, index) => {
          return (
            <div
              className={
                "sidebar-item py-2 pl-5 row align-items-center" +
                (selectedList === list.name ? " selected-sidebar-item" : "")
              }
              onClick={(e) => this.selectList(e)}
              key={list.name}
            >
              <i className="fas fa-bars sidebar-icon"></i>
              {list.name}
              <span className="ml-4 sidebar-count">
                {countIncompletedItems(list)}
              </span>
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
