import React from "react";

import "./Todolist.css";

function ListItem(props) {
  const title = props.title;
  const dueDate = props.dueDate;
  const formattedDate = formatDate(dueDate);
  console.log(props.completed);

  const rowClasses =
    "row justify-content-center pt-2 pb-2 pl-4 pr-1 align-items-center" +
    (props.completed ? " completed" : "");
  return (
    <div className={rowClasses}>
      <div className="col-9 text-left">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          checked={props.completed}
        />
        <span className="ml-2 item-title">{title}</span>
      </div>

      <div className="col-3 text-right item-due-date font-small">
        {formattedDate}
      </div>
    </div>
  );
}

function formatDate(str) {
  const today = new Date();
  const currYear = today.getFullYear();
  // const currDay = today.getDate();
  // const currMonth = today.getMonth() + 1;

  const monthAbbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = parseInt(str.substring(0, 4));
  const month = parseInt(str.substring(5, 7));
  const day = parseInt(str.substring(8, 10));

  var formatted =
    monthAbbr[month - 1] + " " + day + (currYear === year ? "" : ", " + year);

  return formatted;
}

export default ListItem;
