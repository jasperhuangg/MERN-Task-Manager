import React, { Component } from "react";
import "./App.css";
import Todolist from "./todolist/Todolist.js";

const domain = "http://localhost:9000";
var ObjectID = require("bson-objectid");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false, error: null, lists: [] };
  }

  rerender() {
    this.setState({ isLoaded: false });
  }

  // for now assume we are getting the user's username from the props
  // that are being passed in by a Login component (to be created)
  getLists() {
    const url = domain + "/getLists";
    const body = JSON.stringify({
      username: "Jasper" /*this.props.username*/,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        var lists = res;
        this.setState({ lists: lists, isLoaded: true });
      });
  }

  componentDidMount() {
    this.getLists();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded !== prevState.isLoaded) this.getLists();
  }

  addListItem(listName, title, dueDate, description, priority) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        var item = {
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority,
          completed: false,
          itemID: new ObjectID(),
        };
        items.push(item);
        items.sort(sortListItems);
        break;
      }
    }

    this.setState({ lists: lists });

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

  setItemTitle(title) {}

  setItemCompleted(listName, itemID, completed) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].completed = completed;
            break;
          }
        }
        break;
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/setItemCompleted";
    const body = JSON.stringify({
      username: "Jasper",
      listName: listName,
      itemID: itemID,
      completed: completed,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
  }

  setItemDueDate(dueDate) {}

  setItemPriority(priority) {}

  setItemDescription(description) {}

  render() {
    return (
      <div className="App">
        {this.state.lists.map((list, i) => (
          <Todolist
            key={i}
            color={list.color}
            name={list.name}
            items={list.items}
            addListItem={(listName, title, dueDate, description, priority) =>
              this.addListItem(listName, title, dueDate, description, priority)
            }
            setItemTitle={(listName, itemID, title) =>
              this.setItemTitle(listName, itemID, title)
            }
            setItemCompleted={(listName, itemID, completed) =>
              this.setItemCompleted(listName, itemID, completed)
            }
            setItemDueDate={(listName, itemID, dueDate) =>
              this.setItemDueDate(listName, itemID, dueDate)
            }
            setItemPriority={(listName, itemID, priority) =>
              this.setItemPriority(listName, itemID, priority)
            }
          />
        ))}
      </div>
    );
  }
}

function sortListItems(a, b) {
  if (a.completed && !b.completed) return 1;
  else if (!a.completed && b.completed) return -1;
  else if (a.dueDate === "" && b.dueDate !== "") return 1;
  else if (a.dueDate !== "" && b.dueDate === "") return -1;
  else {
    // both are either completed or incomplete or have a due date set or no due date set
    if (a.dueDate === b.dueDate) {
      // sort items due on the same day by priority
      const priorities = ["low", "medium", "high"];
      const priorityA = priorities.indexOf(a.priority);
      const priorityB = priorities.indexOf(b.priority);
      return priorityB - priorityA;
    } else {
      // sort items based on date
      const dateA = new Date(a.dueDate + " 00:00");
      const dateB = new Date(b.dueDate + " 00:00");
      return dateA - dateB;
    }
  }
}
