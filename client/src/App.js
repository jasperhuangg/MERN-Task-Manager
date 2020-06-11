import React, { Component } from "react";
import "./App.css";
import Todolist from "./todolist/Todolist.js";

const domain = "http://localhost:9000";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", isLoaded: false, error: null, lists: [] };
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
      .then(
        (res) => {
          var lists = res;
          this.setState({ isLoaded: true, lists: lists });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
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
    })
      .then((res) => res.text())
      .then(
        (res) => {
          console.log(res);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    this.addListItem("Test List", "postmanTest", "2020-08-12", "", "medium");
    this.getLists();
  }

  render() {
    return (
      <div className="App">
        {this.state.lists.map((list, i) => (
          <Todolist
            key={i}
            color={list.color}
            name={list.name}
            items={list.items}
          />
        ))}
      </div>
    );
  }
}

// // TODO: maybe move this to the back end
// function sortListItems(a, b) {
//   if (a.completed && !b.completed) return 1;
//   else if (!a.completed && b.completed) return -1;
//   else {
//     // both are either completed or incomplete
//     if (a.dueDate === b.dueDate) {
//       // sort items due on the same day by priority
//       const priorities = ["low", "medium", "high"];
//       const priorityA = priorities.indexOf(a.priority);
//       const priorityB = priorities.indexOf(b.priority);
//       return priorityB - priorityA;
//     } else {
//       // sort items based on date
//       const dateA = new Date(a.dueDate);
//       const dateB = new Date(b.dueDate);
//       return dateA - dateB;
//     }
//   }
// }
