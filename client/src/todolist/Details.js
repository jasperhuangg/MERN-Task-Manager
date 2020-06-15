import React, { Component } from "react";

import "./Todolist.css";

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      itemID: this.props.selectedItemID,
      title: this.props.selectedItemTitle,
      dueDate: this.props.selectedItemDueDate,
      priority: this.props.selectedItemPriority,
      description: this.props.selectedItemDescription,
      completed: this.props.selectedItemCompleted,
    };
  }

  handleBlur = (e) => {
    const title = e.target.value;
    if (title !== this.props.selectedItemTitle)
      this.props.setItemTitle(
        this.props.listName,
        this.props.selectedItemID,
        title
      );
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.inputRef.current.blur();
    }
  };

  componentDidUpdate(prevProp) {
    if (
      prevProp.selectedItemTitle === this.props.selectedItemTitle &&
      prevProp.selectedItemCompleted === this.props.selectedItemCompleted &&
      prevProp.selectedItemDescription === this.props.selectedItemDescription &&
      prevProp.selectedItemPriority === this.props.selectedItemPriority &&
      prevProp.selectedItemID === this.props.selectedItemID
    )
      return;
    this.setState({
      title: this.props.selectedItemTitle,
      completed: this.props.selectedItemCompleted,
      description: this.props.selectedItemDescription,
      priority: this.props.selectedItemPriority,
      itemID: this.props.selectedItemID,
    });
  }

  handleCheck(e) {
    var completed = e.target.checked;

    this.props.setItemCompleted(
      this.props.listName,
      this.state.itemID,
      completed
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.state.itemID === "" ? "invisible" : ""}>
          <div
            id="details-top-row"
            className="row align-items-center mt-4 pb-3 justify-content-around mb-4"
          >
            <div className="col-1 details-top-row-check d-flex justify-content-center">
              <input
                className="mx-auto"
                type="checkbox"
                value=""
                checked={this.state.completed}
                onChange={this.handleCheck}
              />
            </div>
            <div className="col-9">date picker </div>
            <div className="col-1">p </div>
          </div>
          <div id="details-title-input-container" className="pb-2">
            <input
              spellCheck="false"
              className="details-title-input"
              placeholder="Title"
              value={this.state.title}
              onKeyDown={(e) => this.handleKeyPress(e)}
              onBlur={(e) => this.handleBlur(e)}
              ref={this.inputRef}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          <div id="details-desc-input-container" className="h-100">
            <textarea
              id="details-desc-input"
              value={this.state.description}
              placeholder="Description"
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
