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
  const color = req.body.color;

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo.collection("Users").findOneAndUpdate(
        {
          username: username,
        },
        {
          $push: {
            lists: {
              name: listName,
              color: color,
              items: [],
            },
          },
        },
        (err, doc) => {
          if (err) res.send("/createEmptyList failed " + err);
          else res.send("/createEmptyList successful");
        }
      );
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
