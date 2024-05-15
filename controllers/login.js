const { User } = require("../models/db");
const validate = require("../middleware/validate");
const messanger = "https://kappa.lol/iSONv";
const logger = require("../logger/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.form = (req, res) => {
  res.render("loginForm", { title: "Login", messanger: messanger });
};

// async function authentificate(dataForm, cb) {
//   try {
//     const user = await User.findOne({
//       where: { email: dataForm.email },
//     });
//     if (!user) return cb();
//     const result = await bcrypt.compare(dataForm.password, user.password);
//     if (result) return cb(null, user);
//     return cb();
//   } catch (err) {
//     return cb(err);
//   }
// }

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
      //jwt generation
      const jwtTime = process.env.JWTTIME;
      const token = jwt.sign(
        {
          name: result.email,
        },
        process.env.JWTTOKENSECRET,
        {
          expiresIn: jwtTime,
        }
      );
      // создание cookie для пользователя
      res.cookie("jwt", token, { httpOnly: true, maxAge: jwtTime });
      logger.info(`Создан новый токен для ${result.email}, Токен: ${token}`);
      return res.redirect("/");
    }
    logger.error("Неправильный логин или пароль");
    return res.redirect("back");
  } catch (err) {
    logger.error(`Ошибка в модуле авторизации: ${err}`);
  }
};
exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
