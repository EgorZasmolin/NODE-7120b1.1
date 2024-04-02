const { User } = require("../models/db");
const jwt = require("jsonwebtoken");
const logger = require("../logger/index_logger");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.form = (req, res) => {
  res.render("loginForm", { title: "Login" });
  logger.info("Зашли");
};

exports.submit = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.loginForm.email },
    });
    if (!user) {
      logger.info("Пользователь не найден");
      return res.redirect("back");
    }
    const result = await bcrypt.compare(
      req.body.loginForm.password,
      user.password
    );
    if (result) {
      req.session.userEmail = req.body.loginForm.email;
      req.session.userName = req.body.loginForm.name;
      // генерация токена
      const jwt_time = process.env.jwtTime;
      const token = jwt.sign(
        { name: req.body.loginForm.email },
        process.env.jwtToken,
        {
          expiresIn: jwt_time,
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: jwt_time,
      });

      logger.info("Token login " + " transferred successfully");
      return res.redirect("/");
    }
    logger.error("Неправильный логин или пароль");
    return res.redirect("back");
  } catch (err) {
    logger.error(`Ошибка в модуле авторизации: ${err}`);
  }
};

exports.logout = function (req, res, next) {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");

  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
