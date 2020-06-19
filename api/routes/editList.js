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
  const newName = req.body.newName;
  const oldName = req.body.oldName;
  const color = req.body.color;

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo.collection("Users").findOneAndUpdate(
        {
          username: username,
          lists: {
            $elemMatch: {
              name: oldName,
            },
          },
        },
        { $set: { "lists.$.name": newName, "lists.$.color": color } },
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
