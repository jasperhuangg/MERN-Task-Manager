var express = require("express");
var router = express.Router();

router.post("/account", (req, res, next) => {
  res.render("account");
});

module.exports = router;
