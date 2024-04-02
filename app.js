const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const app = express();
const myRoutes = require("./routers/index_routers");
const userSession = require("./middleware/user_session");
// const passportFunction = require("./middleware/passport_jwt");
const passportFunctionYandex = require("./middleware/passport_yandex");
const passportFunctionGoogle = require("./middleware/passport_go");
const { sequelize } = require("./models/db");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const port = process.env.PORT || 3000;
app.set("port", port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(morgan('combined'));

app.use(session({ secret: "aboba", resave: false, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passportFunctionYandex(passport);
passportFunctionGoogle(passport);

app.use(
  "/css/bootstrap.css",
  express.static("public/CSS/bootstrap-5.3.2/dist/css/bootstrap.css")
);

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(require("./middleware/messages"));
app.use(userSession);
app.use(myRoutes);

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
    res.render("error");
  });
} else {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"), err.code, err.message);
  });
}

app.listen(port, async function () {
  await sequelize.sync({ force: false });
  console.log(
    "Сервер запущен порт " + port + " все базы данных синхронизированы "
  );
});
