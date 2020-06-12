import React, { Component } from "react";

export default class PrioritiesOverlay extends Component {
  state = { selectedPriority: "medium" };
  render() {
    const highPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.state.selectedPriority === "high" ? " text-primary" : "");
    const mediumPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.state.selectedPriority === "medium" ? " text-primary" : "");
    const lowPriorityClasslist =
      "priorities-overlay-item text-left" +
      (this.state.selectedPriority === "low" ? " text-primary" : "");
    return (
      <div className="overlay priorities-overlay">
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

  handlePriorityItemClick(e) {
    const priority = e.target.innerHTML.toLowerCase();
    this.setState({ selectedPriority: priority });
    this.props.handlePrioritiesOverlayClick(priority);
  }
}
