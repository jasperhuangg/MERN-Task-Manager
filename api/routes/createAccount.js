// TODO: check for duplicate username

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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const encryptedPass = key.encrypt(password, "base64");

  try {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("Todolist");
      dbo
        .collection("Users")
        .find({ username: username })
        .toArray((err, result) => {
          if (result.length)
            res.send({ successful: false, info: "username already exists" });
          else {
            var userObj = {
              username: username,
              firstName: firstName,
              lastName: laastName,
              password: encryptedPass,
              lists: [
                {
                  name: "How to Doozy",
                  color: "#0496FF",
                  items: [
                    {
                      title: "Add items above: Hit [Enter] to add",
                      description: "",
                      dueDate: "",
                      priority: "high",
                      completed: false,
                      itemID: "0",
                    },
                    {
                      title:
                        "Keywords set deadlines/priorities when adding items.",
                      description:
                        'Try adding "Get groceries tmr !medium" or "Hit the gym today !high"',
                      dueDate: "",
                      priority: "medium",
                      completed: false,
                      itemID: "1",
                    },
                    {
                      title: "Set item priorities to affect sorting.",
                      description:
                        "- Try clicking the scale icon and changing the priority!\n- Items are sorted with due dates, then priorities among dates.",
                      dueDate: "",
                      priority: "low",
                      completed: false,
                      itemID: "2",
                    },
                    {
                      title: "Deleting items",
                      description:
                        "Right-click or use [Cmd][Delete] when focused on an item to delete it.",
                      dueDate: "",
                      priority: "low",
                      completed: false,
                      itemID: "3",
                    },
                  ],
                },
              ],
            };

            dbo.collection("Users").insertOne(userObj, (err, result) => {
              if (err) {
                res.send({ success: false, info: err });
                throw err;
              } else {
                res.send({ success: true, info: "" });
              }
            });
          }
        });
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
