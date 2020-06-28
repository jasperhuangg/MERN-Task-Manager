var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const shareTo = req.body.shareTo;
  const listName = req.body.listName;

  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "doozytaskmanager@gmail.com",
      pass: "Doozytaskmanager99!",
    },
  });

  var mailOptions = {
    from: "doozytaskmanager@gmail.com",
    to: shareTo,
    subject:
      firstName +
      ' invited you to collaborate on list "' +
      listName +
      '" on Doozy',
    text: "Click the link to add the list to your account: ",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

module.exports = router;
