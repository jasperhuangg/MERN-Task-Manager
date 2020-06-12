import React, { Component } from "react";
import "./App.css";
import Todolist from "./todolist/Todolist.js";

const domain = "http://localhost:9000";

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

  setItemTitle(title) {}

  setItemCompleted(listName, itemID, completed) {
    const url = domain + "/setItemCompleted";
    const body = JSON.stringify({
      username: "Jasper",
      listName: listName,
      itemID: itemID,
      completed: completed /*this.props.username*/,
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
            addListItem={this.addListItem}
            rerender={() => this.rerender()}
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
