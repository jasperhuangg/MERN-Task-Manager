var express = require("express");
var router = express.Router();

const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb").ObjectID;

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
  const listName = req.body.listName;
  const title = req.body.title;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const priority = req.body.priority;

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo.collection("Users").findOneAndUpdate(
        {
          username: username,
          lists: {
            $elemMatch: {
              name: listName,
            },
          },
        },
        {
          $push: {
            "lists.$.items": {
              title: title,
              description: description,
              dueDate: dueDate,
              priority: priority,
              completed: false,
              itemID: new ObjectID(),
            },
          },
        },
        (err, doc) => {
          if (err) res.send("/addListItem failed");
          else res.send("/addListItem successful");
        }
      );
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
