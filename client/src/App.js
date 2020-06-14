import React, { Component } from "react";
import "./App.css";
import Todolist from "./todolist/Todolist.js";

const domain = "http://localhost:9000";
var ObjectID = require("bson-objectid");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      lists: [],
    };
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

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.isLoaded !== prevState.isLoaded) this.getLists();
  // }

  addListItem(listName, title, dueDate, description, priority) {
    const lists = this.state.lists.slice();
    var objID = null;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        var item = {
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority,
          completed: false,
          itemID: new ObjectID().toString(),
        };
        items.push(item);
        objID = item.itemID;
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
      itemID: objID,
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

  deleteListItem(listName, itemID) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        var items = lists[i].items;
        var idx = -1;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            idx = j;
            break;
          }
        }
        items = items.splice(idx, 1);
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/deleteListItem";
    const body = JSON.stringify({
      username: "Jasper",
      listName: listName,
      itemID: itemID,
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

  setItemTitle(listName, itemID, title) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].title = title;
            break;
          }
        }
        break;
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/setItemTitle";
    const body = JSON.stringify({
      username: "Jasper",
      listName: listName,
      itemID: itemID,
      title: title,
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

  setItemCompleted(listName, itemID, completed) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].completed = completed;
            items.sort(sortListItems);
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

  setListName(oldListName, newListName) {}

  setItemDueDate(dueDate) {}

  setItemPriority(priority) {}

  setItemDescription(description) {}

  render() {
    return (
      <div className="App">
        {this.state.lists.map((list, i) => (
          <Todolist
            key={list.name}
            color={list.color}
            name={list.name}
            items={list.items}
            addListItem={(listName, title, dueDate, description, priority) =>
              this.addListItem(listName, title, dueDate, description, priority)
            }
            deleteListItem={(listName, itemID) =>
              this.deleteListItem(listName, itemID)
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

      if (priorityA !== priorityB) return priorityB - priorityA;
      else {
        // sort by itemID
        const itemIDA = a.itemID;
        const itemIDB = b.itemID;
        return itemIDA - itemIDB;
      }
    } else {
      // sort items based on date
      const dateA = new Date(a.dueDate + " 00:00");
      const dateB = new Date(b.dueDate + " 00:00");
      return dateA - dateB;
    }
  }
}
