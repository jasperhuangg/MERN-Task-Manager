var express = require("express");

var router = express.Router();

const { MongoClient } = require("mongodb");
var NodeRSA = require("node-rsa");

const key = new NodeRSA(
  "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n" +
    "DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n" +
    "VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n" +
    "AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n" +
    "pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n" +
    "QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n" +
    "Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n" +
    "-----END RSA PRIVATE KEY-----"
);

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
              const decryptedPass = key.decrypt(result[0].password, "utf8");
              if (decryptedPass === password)
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
