var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cookierParser = require("cookie-parser");
var cors = require("cors");

var appRouter = require("./routes/app");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");
var getListsRouter = require("./routes/getLists");
var addItemRouter = require("./routes/addListItem");
var deleteItemRouter = require("./routes/deleteListItem");
var setItemCompletedRouter = require("./routes/setItemCompleted");
var setItemDescriptionRouter = require("./routes/setItemDescription");
var setItemDueDateRouter = require("./routes/setItemDueDate");
var setItemPriorityRouter = require("./routes/setItemPriority");
var setItemTitleRouter = require("./routes/setItemTitle");
var verifyLoginRouter = require("./routes/verifyLogin");
var createAccountRouter = require("./routes/createAccount");
var createEmptyListRouter = require("./routes/createEmptylist");
var deleteListRouter = require("./routes/deleteList");
var editListRouter = require("./routes/editList");
var accountExistsRouter = require("./routes/accountExists");
var deleteCompletedItemsRouter = require("./routes/deleteCompletedItems");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookierParser("abcdef-12345"));

app.use("/verifyLogin", verifyLoginRouter);
app.use("/createAccount", createAccountRouter);
app.use("/app", appRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/getLists", getListsRouter);
app.use("/addListItem", addItemRouter);
app.use("/deleteListItem", deleteItemRouter);
app.use("/setItemCompleted", setItemCompletedRouter);
app.use("/setItemDescription", setItemDescriptionRouter);
app.use("/setItemDueDate", setItemDueDateRouter);
app.use("/setItemPriority", setItemPriorityRouter);
app.use("/setItemTitle", setItemTitleRouter);
app.use("/createEmptyList", createEmptyListRouter);
app.use("/deleteList", deleteListRouter);
app.use("/editList", editListRouter);
app.use("/accountExists", accountExistsRouter);
app.use("/deleteCompletedItems", deleteCompletedItemsRouter);

app;

// catch 404 and forward to error handler:
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
