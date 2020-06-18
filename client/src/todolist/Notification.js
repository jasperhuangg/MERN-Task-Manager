import React, { Component } from "react";

export default class Notification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const itemTitle = this.props.title;
    const listName = this.props.listName;
    const notificationClasses =
      "notification p-3 shadow" +
      (this.props.displaying ? " notification-displayed" : "");
    return (
      <div className={notificationClasses}>
        <div>
          "{itemTitle}" was just deleted from <br />"{listName}"
        </div>
        <div className="row">
          <div className="col-9"></div>
          <div
            className="col-3 text-primary undo-button"
            style={{ cursor: "pointer" }}
          >
            Undo
          </div>
        </div>
      </div>
    );
  }
}
