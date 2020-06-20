import React, { Component } from "react";

export default class Toolbar extends Component {
  render() {
    return (
      <>
        <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
          <i className="fas fa-cogs"></i>
        </div>
        <div
          className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center"
          onClick={(e) => {
            e.preventDefault();
            if (
              this.props.currentlySelectedListName !== "Today" &&
              this.props.currentlySelectedListName !== "Next 7 Days" &&
              this.props.currentlySelectedListName !== "All"
            ) {
              var confirmed = window.confirm(
                'Clear all completed items for "' +
                  this.props.currentlySelectedListName +
                  '"?'
              );
              if (confirmed) {
                // delete all completed items
                this.props.deleteAllCompletedItems();
              }
            }
          }}
        >
          <i className="fas fa-hand-sparkles"></i>
        </div>
        <div className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center">
          <i className="fas fa-share-alt"></i>
        </div>
        <div
          className="toolbar-icon col-10 mx-1 text-center d-flex justify-content-center align-items-center"
          onClick={() => this.props.handleLogOut()}
        >
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </>
    );
  }
}
