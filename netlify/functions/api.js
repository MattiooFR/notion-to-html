"use strict"

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var serverless = require("serverless-http");

var app = express();
var bodyParser = require("body-parser");



// view engine setup
app.set("views", __dirname + "/../../views");
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/../../public")));

var router = express.Router();

router.get("/", (req, res) =>
   res.status(400).json({
      status: 400,
      message: "missing_pageid",
      details: "pageId query parameter missing",
   })
);

router.get("/html-to-notion", require("./../../routes/htmlToNotion").index);
router.get("/:pageId", require("./../../routes").index);

app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);  // path must route to lambda

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});




// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   console.log(err);
   res.status(err.status || 500).send(`<pre>${err.stack}</pre>`);
});

module.exports = app;
module.exports.handler = serverless(app);
