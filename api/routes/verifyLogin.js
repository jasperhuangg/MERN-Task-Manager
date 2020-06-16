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
  const password = req.body.password;

  // TODO: add logic for decrypting password after implementing create account

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo
        .collection("Users")
        .find({
          username: username,
        })
        .toArray((err, result) => {
          if (err) throw err;
          else {
            if (result.length === 0)
              res.send({ success: false, info: "username does not exist" });
            else {
              if (result[0].password === password)
                res.send({ success: true, info: "login successful" });
              else
                res.send({
                  success: false,
                  info: "incorrect password",
                });
            }
          }
        });
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
