import React, { Component } from "react";

export default class Notification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: put this inside a function
    var itemTitle = this.props.title;
    if (itemTitle !== undefined && itemTitle.length > 16)
      itemTitle = itemTitle.substring(0, 16) + "...";
    else if (itemTitle !== undefined && itemTitle.length === 0)
      itemTitle = "[Empty Title]";
    if (itemTitle !== undefined && itemTitle !== "[Empty Title]")
      itemTitle = '"' + itemTitle + '"';

    const listName = this.props.listName;
    const notificationClasses =
      "notification p-3 shadow" +
      (this.props.displaying ? " notification-displayed" : "");
    return (
      <div className={notificationClasses}>
        <div>
          {itemTitle} was deleted from <br />"{listName}"
        </div>
        <div className="row">
          <div className="col-9"></div>
          <div
            className="col-3 text-primary undo-button"
            style={{ cursor: "pointer", fontWeight: "600" }}
            onClick={() => {
              this.props.undo();
              this.props.hideNotification();
            }}
          >
            Undo
          </div>
        </div>
      </div>
    );
  }
}
