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
  const itemID = req.body.itemID;
  var idx = -1;

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
                for (let i = 0; i < items.length; i++) {
                  if (items[i].itemID === itemID) {
                    idx = i;
                    break;
                  }
                }
                items.splice(idx, 1);
                res.send(
                  "SERVER: deleted item with itemID: " +
                    itemID +
                    " at index: " +
                    idx
                );
              }
            });
          }
          dbo.collection("Users").save(user);
        });
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
