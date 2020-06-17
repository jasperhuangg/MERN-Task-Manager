import React, { Component } from "react";
import "./App.css";
import Todolist from "./todolist/Todolist.js";
import Details from "./todolist/Details.js";
import Login from "./todolist/Login.js";
import Register from "./todolist/Register.js";
import $ from "jquery";

var ObjectID = require("bson-objectid");

const domain = "http://localhost:9000";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docTitle: "Log in | Doozy",
      loggedIn: "not yet",
      loginOrRegister: "login",
      error: null,
      lists: [],
      username: "jasperhu@usc.edu",
      currentlySelectedList: 0,
      currentlySelectedItemID: "",
      bgURL: "",
    };
  }

  componentDidMount() {
    // this will be where you check for the cookie
    // if the cookie is valid, then
    // this.setState({
    //   loggedIn: "successful",
    //   username: "[whatever was in the cookie]",
    // });

    // visit https://freeimage.host/ to host more background images
    const backgroundURLs = [
      "https://iili.io/J4xbBS.jpg",
      "https://iili.io/J4xtQ2.jpg",
      "https://iili.io/J4xZhl.jpg",
      "https://iili.io/J4xp49.jpg",
      "https://iili.io/J4xQI4.jpg",
      "https://iili.io/J4xmE7.jpg",
      "https://iili.io/J4z92e.jpg",
      "https://iili.io/J4zdpj.jpg",
      "https://iili.io/J4z3Tx.jpg",
      "https://iili.io/J4zJkb.jpg",
      "https://iili.io/J4zHYu.jpg",
    ];
    var currBackground = Math.floor(
      Math.random() * Math.floor(backgroundURLs.length)
    );

    const bgURL = 'url("' + backgroundURLs[currBackground] + '")';

    console.log(bgURL);

    this.setState({ bgURL: bgURL });
  }

  verifyLogin(username, password) {
    const url = domain + "/verifyLogin";
    const body = JSON.stringify({
      username: username,
      password: password,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          this.getLists();
          this.setState({ docTitle: "Lists | Doozy", loggedIn: "successful" });
        } else if (res.info === "username does not exist")
          this.setState({ loggedIn: "username does not exist" });
        else if (res.info === "incorrect password")
          this.setState({ loggedIn: "incorrect password" });
      });
  }

  setSelectedItem(itemID) {
    this.setState({ currentlySelectedItemID: itemID });
  }

  getCurrentlySelectedItem() {
    if (this.state.currentlySelectedItemID === "")
      return {
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        completed: false,
        itemID: "",
      };

    var items = this.state.lists.slice(this.state.currentlySelectedList)[0]
      .items;

    for (let i = 0; i < items.length; i++)
      if (items[i].itemID === this.state.currentlySelectedItemID)
        return items[i];
  }

  // for now assume we are getting the user's username from the props
  // that are being passed in by a Login component (to be created)
  getLists() {
    const url = domain + "/getLists";
    const body = JSON.stringify({
      username: this.state.username /*this.props.username*/,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        var lists = res;
        this.setState({ lists: lists });
      });
  }

  addListItem(listName, title, dueDate, description, priority) {
    const lists = this.state.lists.slice();
    var id = null;
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
        id = item.itemID;
        items.sort(sortListItems);
        break;
      }
    }

    this.setState({ lists: lists, currentlySelectedItemID: id });

    const url = domain + "/addListItem";
    const body = JSON.stringify({
      username: this.state.username,
      listName: listName,
      title: title,
      dueDate: dueDate,
      description: description,
      priority: priority,
      itemID: id,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  deleteListItem(listName, itemID) {
    console.log("/deleteListItem called with " + itemID);
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

    this.setState({ lists: lists, currentlySelectedItemID: "" });

    const url = domain + "/deleteListItem";
    const body = JSON.stringify({
      username: this.state.username,
      listName: listName,
      itemID: itemID,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.text())
      .then((res) => console.log(res));
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
      username: this.state.username,
      listName: listName,
      itemID: itemID,
      title: title,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.text())
      .then((res) => console.log(res));
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
      username: this.state.username,
      listName: listName,
      itemID: itemID,
      completed: completed,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  setListName(oldListName, newListName) {}

  setItemDueDate(listName, itemID, dueDate) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].dueDate = dueDate;
            items.sort(sortListItems);
            break;
          }
        }
        break;
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/setItemDueDate";
    const body = JSON.stringify({
      username: this.state.username,
      listName: listName,
      itemID: itemID,
      dueDate: dueDate,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  setItemPriority(listName, itemID, priority) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].priority = priority;
            items.sort(sortListItems);
            break;
          }
        }
        break;
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/setItemPriority";
    const body = JSON.stringify({
      username: this.state.username,
      listName: listName,
      itemID: itemID,
      priority: priority,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  verifyCookie() {}

  toggleLoginRegister() {
    if (this.state.loginOrRegister === "login")
      this.setState({
        docTitle: "Sign Up | Doozy",
        loginOrRegister: "register",
      });
    else if (this.state.loginOrRegister === "register")
      this.setState({
        docTitle: "Log In | Doozy",
        loginOrRegister: "login",
      });
  }

  setItemDescription(listName, itemID, description) {
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            items[j].description = description;
            break;
          }
        }
        break;
      }
    }

    this.setState({ lists: lists });

    const url = domain + "/setItemDescription";
    const body = JSON.stringify({
      username: this.state.username,
      listName: listName,
      itemID: itemID,
      description: description,
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  render() {
    document.title = this.state.docTitle;

    const listArr = this.state.lists.slice(this.state.currentlySelectedList, 1);

    const selectedItem = this.getCurrentlySelectedItem();
    const appClasses =
      "row align-items-center" +
      (this.state.loggedIn === "successful" ? "" : " d-none");
    const loginRegClasses =
      "container-fluid align-items-center" +
      (this.state.loggedIn === "successful" ? " d-none" : " d-flex ");

    return (
      <>
        <div
          id="login-register"
          style={{ backgroundImage: this.state.bgURL }}
          className={loginRegClasses}
        >
          <div
            className={
              "login-section" +
              (this.state.loginOrRegister === "login" ? "" : " invisible")
            }
          >
            <Login
              loginInfo={this.state.loggedIn}
              verifyLogin={(username, password) =>
                this.verifyLogin(username, password)
              }
              switchToRegister={() => this.toggleLoginRegister()}
            />
          </div>
          <div
            className={
              "register-section" +
              (this.state.loginOrRegister === "register" ? "" : " invisible")
            }
          >
            <Register switchToLogin={() => this.toggleLoginRegister()} />
          </div>
        </div>
        <div
          id="app"
          style={{ backgroundImage: this.state.bgURL }}
          className={appClasses}
        >
          <div id="sidebar" className="col-2"></div>
          {listArr.map((list, i) => {
            return (
              <React.Fragment key={list.name}>
                <div id="todolist" className="col-6">
                  <Todolist
                    color={list.color}
                    name={list.name}
                    items={list.items}
                    addListItem={(
                      listName,
                      title,
                      dueDate,
                      description,
                      priority
                    ) =>
                      this.addListItem(
                        listName,
                        title,
                        dueDate,
                        description,
                        priority
                      )
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
                    setSelectedItem={(itemID) => this.setSelectedItem(itemID)}
                    selectedItemID={this.state.currentlySelectedItemID}
                  />
                </div>
                <div id="details" className="col-4">
                  <Details
                    listName={list.name}
                    selectedItemID={selectedItem.itemID}
                    selectedItemTitle={selectedItem.title}
                    selectedItemDueDate={selectedItem.dueDate}
                    selectedItemDescription={selectedItem.description}
                    selectedItemPriority={selectedItem.priority}
                    selectedItemCompleted={selectedItem.completed}
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
                    setItemDescription={(listName, itemID, description) =>
                      this.setItemDescription(listName, itemID, description)
                    }
                    handleDelete={(listName, itemID) =>
                      this.deleteListItem(listName, itemID)
                    }
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </>
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
