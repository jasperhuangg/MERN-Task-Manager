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
  const listName = req.body.listName;

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo
        .collection("Users")
        .find({
          username: username,
        })
        .forEach((user) => {
          if (user.lists) {
            user.lists.forEach((list) => {
              if (list.name === listName) {
                var items = list.items;
                var counter = 0;

                while (counter !== items.length) {
                  var item = items[counter];
                  if (item.completed) items.splice(counter, 1);
                  else counter++;
                }
              }
            });
          }
          dbo.collection("Users").save(user);
          res.send({ msg: "saved " + username, lists: user.lists });
        });
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
