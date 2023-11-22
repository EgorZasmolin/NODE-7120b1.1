const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/css/bootstrap.css",
  express.static("public/CSS/bootstrap-5.3.2/dist/css/bootstrap.css")
);

app.use(favicon(__dirname + "/public/favicon.ico"));
const port = "3000";

app.get("/", (req, res) => {
  addLine("Пинганули /");
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/test", (req, res) => {
  addLine("Пинганули /test");

  console.log("прошли по пути test");
  res.end("прошли ");
});

app.post("/test", (req, res) => {
  addLine("Пинганули /test");
  console.log("прошли по пути post test");
  res.end("прошли post test");
});

function addLine(line) {
  line = line + " timestamp: " + new Date().toLocaleString();
  fs.appendFile(
    path.join(__dirname + "/public/logger.txt"),
    line + "\n",
    (err) => {
      if (err) console.log(err);
    }
  );
}
//error handler

app.use(function (req, res, next) {
  const err = new Error("NO FOUND ERROR");
  err.code = 404;
  next(err);
});

// console.log(app.get("env"));

if (app.get("env") != "development") {
  app.use(function (err, req, res, next) {
    res.status = 404;
    let img1 = "http://loc";
    res.render("error", {err,img1});
  });
} else {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"), err.code, err.message);
  });
}

app.listen(port, function () {
  console.log("Сервер запущен порт " + port);
});