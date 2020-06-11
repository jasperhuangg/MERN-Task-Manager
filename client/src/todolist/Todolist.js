import React from "react";
import Details from "./Details.js";
import ListItem from "./ListItem.js";

import "./Todolist.css";

function Todolist(props) {
  const name = props.name;
  const items = props.items;
  const color = props.color;

  const placeholder = 'Add a task to "' + name + '"';

  return (
    // w-50 class is temporary
    <div className="container-fluid w-50">
      <h1 className="text-right my-4">{name}</h1>
      <div className="input-group mb-4">
        <input className="form-control" type="text" placeholder={placeholder} />
        <div className="input-group-append">
          <span className="input-group-text icon">
            <i className="fas fa-balance-scale-left"></i>
          </span>
        </div>
        <div className="input-group-append">
          <span className="input-group-text icon">
            <i className="fas fa-calendar-alt"></i>
          </span>
        </div>
      </div>
      {items.map((item, i) => (
        <ListItem
          key={i}
          title={item.title}
          description={item.description}
          priority={item.priority}
          dueDate={item.dueDate}
          completed={item.completed}
        />
      ))}
    </div>
  );
}

export default Todolist;
