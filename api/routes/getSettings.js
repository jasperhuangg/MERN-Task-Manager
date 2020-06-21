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
            var resObj = {
              sorting: result[0].sorting,
              keywords: result[0].keywords,
              background: result[0].background,
            };
            res.send(JSON.stringify(resObj));
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

module.exports = router;
