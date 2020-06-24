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
  const keywords = req.body.keywords;

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
          user.keywords = keywords;
          dbo.collection("Users").save(user);
        });
      res.send("saved");
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
