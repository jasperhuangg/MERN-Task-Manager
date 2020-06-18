import React, { Component } from "react";
import Cookies from "universal-cookie";
import "./App.css";

// import $ from "jquery";

import Todolist from "./todolist/Todolist.js";
import Details from "./todolist/Details.js";
import Login from "./todolist/Login.js";
import Register from "./todolist/Register.js";
import Sidebar from "./todolist/Sidebar.js";
import Notification from "./todolist/Notification.js";

var ObjectID = require("bson-objectid");
const cookies = new Cookies();

const domain = "http://localhost:9000";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docTitle: "Log in | Doozy",
      loggedIn: "not yet",
      registered: "not yet",
      loginOrRegister: "login",
      lists: [],
      username: "",
      currentlySelectedListIndex: 0,
      currentlySelectedListName: "",
      currentlySelectedItemID: "",
      bgURL: "",
      firstName: "",
      lastName: "",
      loaded: false,
      notificationDisplaying: false,
      lastDeletedItem: {},
      lastDeletedItemListName: "",
    };
  }

  componentDidMount() {
    // this will be where you check for the cookie
    // if the cookie is valid, then
    // this.setState({
    //   loggedIn: "successful",
    //   username: "[whatever was in the cookie]",
    // });

    var username = "";
    var firstName = "";
    var lastName = "";
    var loggedIn = "not yet";
    var docTitle = this.state.docTitle;

    if (cookies.get("DoozyLogin") !== undefined) {
      username = cookies.get("DoozyLogin").email;
      firstName = cookies.get("DoozyLogin").firstName;
      lastName = cookies.get("DoozyLogin").lastName;
      loggedIn = "successful";

      // extend the expiration date of the cookie
      var aWeekFromNow = new Date();
      aWeekFromNow.setDate(aWeekFromNow.getDate() + 7);
      cookies.set(
        "DoozyLogin",
        { email: username, firstName: firstName, lastName: lastName },
        {
          path: "/",
          expires: aWeekFromNow,
        }
      );
      docTitle = "Lists | Doozy";
    }

    const bgURL = getRandomBGURL();

    this.setState({
      bgURL: bgURL,
      username: username,
      firstName: firstName,
      lastName: lastName,
      loggedIn: loggedIn,
      docTitle: docTitle,
    });
  }

  componentDidUpdate() {
    if (this.state.loaded === false && this.state.loggedIn === "successful") {
      this.setState({ loaded: true });
      this.getLists();
    }
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
          this.setState({
            docTitle: "Lists | Doozy",
            loggedIn: "successful",
            username: username,
            firstName: res.firstName,
            lastName: res.lastName,
          });
          this.getLists();
          // set a cookie
          var aWeekFromNow = new Date();
          aWeekFromNow.setDate(aWeekFromNow.getDate() + 7);
          cookies.set(
            "DoozyLogin",
            {
              email: username,
              firstName: res.firstName,
              lastName: res.lastName,
            },
            {
              path: "/",
              expires: aWeekFromNow,
            }
          );
        } else if (res.info === "username does not exist")
          this.setState({ loggedIn: "username does not exist" });
        else if (res.info === "incorrect password")
          this.setState({ loggedIn: "incorrect password" });
      });
  }

  createAccount(email, firstName, lastName, password) {
    if (email === "" || firstName === "" || lastName === "" || password === "")
      this.setState({ registered: "empty field(s)" });
    else if (!ValidateEmail(email))
      this.setState({ registered: "invalid email" });
    else if (password.length < 6)
      this.setState({ registered: "password length" });
    else {
      const url = domain + "/createAccount";
      const body = JSON.stringify({
        username: email,
        firstName: firstName,
        lastName: lastName,
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
            this.setState({
              docTitle: "Lists | Doozy",
              loggedIn: "successful",
              registered: "successful",
              username: email,
              firstName: firstName,
              lastName: lastName,
            });
            this.getLists();
            // set a cookie
            var aWeekFromNow = new Date();
            aWeekFromNow.setDate(aWeekFromNow.getDate() + 7);
            cookies.set(
              "DoozyLogin",
              { email: email, firstName: firstName, lastName: lastName },
              {
                path: "/",
                expires: aWeekFromNow,
              }
            );
          } else if (res.info === "username already exists") {
            this.setState({ registered: "username already exists" });
          }
        });
    }
  }

  setSelectedItem(itemID) {
    this.setState({ currentlySelectedItemID: itemID });
  }

  setSelectedList(listName) {
    var index;

    if (listName === "Today") index = this.state.lists.length - 3;
    if (listName === "Next 7 Days") index = this.state.lists.length - 2;
    if (listName === "All") index = this.state.lists.length - 1;
    else {
      for (let i = 0; i < this.state.lists.length; i++) {
        if (this.state.lists[i].name === listName) {
          index = i;
          break;
        }
      }
    }
    this.setState({
      currentlySelectedListName: listName,
      currentlySelectedListIndex: index,
    });
  }

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

    var items = this.state.lists.slice(this.state.currentlySelectedListIndex)[0]
      .items;

    for (let i = 0; i < items.length; i++)
      if (items[i].itemID === this.state.currentlySelectedItemID)
        return items[i];

    return {
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      completed: false,
      itemID: "",
    };
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

        lists = this.appendSmartLists(lists);

        this.setState({
          lists: lists,
          currentlySelectedListName: lists[0].name,
        });
      });
  }

  appendSmartLists(lists) {
    var next7Days = this.getNext7Days(lists);
    var today = this.getToday(lists);
    var all = this.getAll(lists);

    lists.push(today);
    lists.push(next7Days);
    lists.push(all);

    return lists;
  }

  getNext7Days(lists) {
    var next7Days = {
      name: "Next 7 Days",
      color: "",
      items: [],
    };

    for (let i = 0; i < lists.length; i++) {
      const items = lists[i].items;
      for (let j = 0; j < items.length; j++) {
        if (checkIfNext7Days(items[j].dueDate)) {
          next7Days.items.push(items[j]);
        }
      }
    }
    next7Days.items.sort(sortListItems);

    return next7Days;
  }

  getAll(lists) {
    var all = {
      name: "All",
      color: "",
      items: [],
    };

    for (let i = 0; i < lists.length; i++) {
      // const items = lists[i].items;
      // for (let j = 0; j < items.length; j++) {
      //   if (!items[j].completed) {
      //     all.items.push(items[j]);
      //   }
      // }
      all.items = all.items.concat(lists[i].items);
    }

    all.items.sort(sortListItems);

    return all;
  }

  getToday(lists) {
    var today = {
      name: "Today",
      color: "",
      items: [],
    };

    var t = dateToStr(new Date());

    for (let i = 0; i < lists.length; i++) {
      const items = lists[i].items;
      for (let j = 0; j < items.length; j++) {
        if (items[j].dueDate === t) {
          today.items.push(items[j]);
        }
      }
    }
    today.items.sort(sortListItems);

    return today;
  }

  addListItem(listName, title, dueDate, description, priority) {
    const lists = this.state.lists.slice();
    var id = null;
    var item = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      completed: false,
      itemID: new ObjectID().toString(),
    };
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        const items = lists[i].items;
        items.push(item);
        id = item.itemID;
        items.sort(sortListItems);
        break;
      }
    }

    var today = dateToStr(new Date());
    if (dueDate === today) {
      lists[lists.length - 3].items.push(item);
      lists[lists.length - 3].items.sort(sortListItems);
    }
    if (checkIfNext7Days(dueDate)) {
      lists[lists.length - 2].items.push(item);
      lists[lists.length - 2].items.sort(sortListItems);
    }
    lists[lists.length - 1].items.push(item);
    lists[lists.length - 1].items.sort(sortListItems);

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
    var dueDate = "";
    var item;
    const lists = this.state.lists.slice();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === listName) {
        var items = lists[i].items;
        var idx = -1;
        for (let j = 0; j < items.length; j++) {
          if (items[j].itemID === itemID) {
            idx = j;
            dueDate = items[j].dueDate;
            item = items[j];
            break;
          }
        }
        items = items.splice(idx, 1);
      }
    }

    let index = -1;
    var today = dateToStr(new Date());
    if (dueDate === today) {
      items = lists[lists.length - 3].items;
      for (let j = 0; j < items.length; j++) {
        if (items[j].itemID === itemID) {
          index = j;
          break;
        }
      }
      items = items.splice(index, 1);
    }
    if (checkIfNext7Days(dueDate)) {
      items = lists[lists.length - 2].items;
      for (let j = 0; j < items.length; j++) {
        if (items[j].itemID === itemID) {
          index = j;
          break;
        }
      }
      items = items.splice(index, 1);
    }
    items = lists[lists.length - 1].items;
    for (let j = 0; j < items.length; j++) {
      if (items[j].itemID === itemID) {
        index = j;
        break;
      }
    }
    items = items.splice(index, 1);

    console.log(item);
    this.setState({
      lists: lists,
      currentlySelectedItemID: "",
      lastDeletedItem: item,
      lastDeletedItemListName: listName,
    });

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
    }).then((res) => res.text());
    this.handleDisplayNotification();
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
    }).then((res) => res.text());
  }

  setItemCompleted(listName, itemID, completed) {
    var lists = this.state.lists.slice();
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

    lists = lists.slice(0, lists.length - 3);
    lists = this.appendSmartLists(lists);

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
    var lists = this.state.lists.slice();
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

    lists = lists.slice(0, lists.length - 3);
    lists = this.appendSmartLists(lists);

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

  handleLogOut() {
    // delete the cookie
    cookies.remove("DoozyLogin");

    const bgURL = getRandomBGURL();

    // reset state back to start
    this.setState({
      docTitle: "Log in | Doozy",
      loggedIn: "not yet",
      registered: "not yet",
      loginOrRegister: "login",
      lists: [],
      username: "",
      currentlySelectedListIndex: 0,
      currentlySelectedListName: "",
      currentlySelectedItemID: "",
      bgURL: bgURL,
      firstName: "",
      lastName: "",
      loaded: false,
    });
  }

  handleDisplayNotification() {
    console.log("in");
    this.setState({ notificationDisplaying: true });
    setTimeout(() => {
      console.log("out");
      this.setState({ notificationDisplaying: false });
    }, 5000);
  }

  render() {
    document.title = this.state.docTitle;

    const listArr = this.state.lists.slice(
      this.state.currentlySelectedListIndex,
      this.state.currentlySelectedListIndex + 1
    );

    var lastDeletedItemTitle = "";
    if (this.state.lastDeletedItem !== undefined)
      lastDeletedItemTitle = this.state.lastDeletedItem.title;

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
              (this.state.loginOrRegister === "login" ? "" : " d-none")
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
              (this.state.loginOrRegister === "register" ? "" : " d-none")
            }
          >
            <Register
              switchToLogin={() => this.toggleLoginRegister()}
              createAccount={(email, fName, lName, password) =>
                this.createAccount(email, fName, lName, password)
              }
              registerInfo={this.state.registered}
            />
          </div>
        </div>
        <div
          id="app"
          style={{ backgroundImage: this.state.bgURL }}
          className={appClasses}
        >
          <Notification
            displaying={this.state.notificationDisplaying}
            title={lastDeletedItemTitle}
            listName={this.state.lastDeletedItemListName}
          />
          <div id="sidebar" className="p-0">
            <Sidebar
              lists={this.state.lists}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              currentlySelectedListName={this.state.currentlySelectedListName}
              setSelectedList={(listName) => this.setSelectedList(listName)}
            />
          </div>
          {listArr.map((list, i) => {
            return (
              <React.Fragment key={list.name}>
                <div id="todolist" className="col-5">
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
                <div id="toolbar" className="h-25 row justify-content-center">
                  <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
                    <i className="fas fa-cogs"></i>
                  </div>
                  <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
                    <i className="fas fa-hand-sparkles"></i>
                  </div>
                  <div
                    className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center"
                    onClick={() => this.handleLogOut()}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
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

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function getRandomBGURL() {
  // visit https://freeimage.host/ to host more background images
  const backgroundURLs = [
    "https://iili.io/J4xbBS.jpg",
    "https://iili.io/J4xtQ2.jpg",
    "https://iili.io/J4z92e.jpg",
    "https://iili.io/J4zdpj.jpg",
    "https://iili.io/J4zJkb.jpg",
    "https://iili.io/J4zWZl.jpg",
    "https://iili.io/J4Weln.jpg",
    "https://iili.io/J4WhoN.jpg",
    "https://iili.io/J4WwPt.jpg",
    "https://iili.io/J4WOKX.jpg",
    "https://iili.io/J4WUN4.jpg",
    "https://iili.io/J4WgDl.jpg",
    "https://iili.io/J4WSRf.jpg",
    "https://iili.io/J4WmDQ.jpg",
    "https://iili.io/J4X9WB.jpg",
    "https://iili.io/J4XHiP.jpg",
    "https://iili.io/J4WyxV.jpg",
  ];
  var currBackground = Math.floor(
    Math.random() * Math.floor(backgroundURLs.length)
  );

  return 'url("' + backgroundURLs[currBackground] + '")';
}

function dateToStr(date) {
  var day = date.getDate();
  if (day < 10) day = "0" + day.toString();

  var month = date.getMonth() + 1;
  if (month < 10) month = "0" + month.toString();

  var year = date.getFullYear().toString();

  var formatted = year + "-" + month + "-" + day;

  return formatted;
}

function checkIfNext7Days(dateStr) {
  var curr = new Date();
  for (let i = 0; i < 7; i++) {
    var d = dateToStr(curr);
    if (dateStr === d) return true;
    curr.setDate(curr.getDate() + 1);
  }

  d = dateToStr(curr);
  if (dateStr === d) return true;

  return false;
}
