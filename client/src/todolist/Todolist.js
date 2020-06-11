import React, { Component } from "react";
import Details from "./Details.js";
import ListItem from "./ListItem.js";

import "./Todolist.css";

const domain = "http://localhost:9000";

export default class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addItemValue: "",
    };
  }

  keyPress(e) {
    // hardcoded date and priority values as UI components not yet implemented
    if (e.keyCode == 13) {
      this.addListItem(
        this.props.name,
        this.state.addItemValue,
        "2020-06-21",
        "",
        "medium"
      );
      document.getElementById("addItemInput").value = "";
      this.props.rerender();
    }
  }

  handleInput(e) {
    this.setState({ addItemValue: e.target.value });
  }

  addListItem(listName, title, dueDate, description, priority) {
    const url = domain + "/addListItem";
    const body = JSON.stringify({
      username: "Jasper",
      listName: listName,
      title: title,
      dueDate: dueDate,
      description: description,
      priority: priority,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    }).then((res) => res.text());
  }

  // setCompleted(listName, )

  render() {
    const name = this.props.name;
    const items = this.props.items;
    const color = this.props.color;

    const placeholder = 'Add a task to "' + name + '"';

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
          <div className="input-group-append">
            <span className="input-group-text icon">
              <i className="fas fa-balance-scale-left"></i>
            </span>
          </div>
          <div className="input-group-append">
            <span className="input-group-text icon">
              <i className="fas fa-calendar-alt"></i>
            </span>
          </div>
        </div>
        {items.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            description={item.description}
            priority={item.priority}
            dueDate={item.dueDate}
            completed={item.completed}
            itemID={item.itemID}
          />
        ))}
      </div>
    );
  }
}
