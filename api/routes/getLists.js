var express = require("express");
var router = express.Router();

const { MongoClient } = require("mongodb");

/* MongoDB init */
const dbUser = "dbUser";
const dbPass = "P9HP4wGPK083cIec";
const uri =
  "mongodb+srv://" +
  dbUser +
  ":" +
  dbPass +
  "@cluster0-ajgge.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";

router.post("/", (req, res, next) => {
  const username = req.body.username;

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo
        .collection("Users")
        .find({ username: username })
        .toArray((err, result) => {
          if (err) throw err;
          if (result.length) {
            var lists = result[0].lists;
            var sortingFunction =
              result[0].sorting === "dates first"
                ? sortListItemsDatesFirst
                : sortListItemsPrioritiesFirst;
            for (let i = 0; i < lists.length; i++)
              lists[i].items.sort(sortingFunction);
            res.send(JSON.stringify(lists));
          } else {
            res.send("Username not found.");
          }
          db.close();
        });
    });
  } catch (e) {
    console.error(e);
  }
});

function sortListItemsDatesFirst(a, b) {
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

function sortListItemsPrioritiesFirst(a, b) {
  if (a.completed && !b.completed) return 1;
  else if (!a.completed && b.completed) return -1;
  else {
    // sort items due priority first
    const priorities = ["low", "medium", "high"];
    const priorityA = priorities.indexOf(a.priority);
    const priorityB = priorities.indexOf(b.priority);
    // if they have the same priority, sort by due date
    if (priorityB === priorityA) {
      if (a.dueDate === "" && b.dueDate !== "") return 1;
      else if (a.dueDate !== "" && b.dueDate === "") return -1;

      // sort items based on date
      const dateA = new Date(a.dueDate + " 00:00");
      const dateB = new Date(b.dueDate + " 00:00");

      if (a.dueDate !== b.dueDate) return dateA - dateB;
      else {
        // sort by itemID
        const itemIDA = a.itemID;
        const itemIDB = b.itemID;
        return itemIDA - itemIDB;
      }
    } else return priorityB - priorityA;
  }
}

module.exports = router;
