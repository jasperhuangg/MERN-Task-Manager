import React, { Component } from "react";

export default class PrioritiesOverlay extends Component {
  state = {
    selectedPriority: this.props.currentlySelectedPriority,
  };

  handlePriorityItemClick(e) {
    const priority = e.target.innerHTML.toLowerCase();
    this.setState({ selectedPriority: priority });
    this.props.handlePrioritiesOverlayClick(priority);
  }

  render() {
    const highPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.props.currentlySelectedPriority === "high" ? " text-danger" : "");
    const mediumPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.props.currentlySelectedPriority === "medium"
        ? " text-warning"
        : "");
    const lowPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.props.currentlySelectedPriority === "low" ? " text-primary" : "");
    return (
      <div className="overlay priorities-overlay shadow">
        <div
          className={highPriorityClasslist}
          onClick={(e) => this.handlePriorityItemClick(e)}
        >
          High
        </div>
        <div
          className={mediumPriorityClasslist}
          onClick={(e) => this.handlePriorityItemClick(e)}
        >
          Medium
        </div>
        <div
          className={lowPriorityClasslist}
          onClick={(e) => this.handlePriorityItemClick(e)}
        >
          Low
        </div>
      </div>
    );
  }
}
