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
        .updateOne(
          { username: username },
          { $pull: { lists: { name: listName } } },
          (err, obj) => {
            if (err) throw err;
            else res.send("success");
          }
        );
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
