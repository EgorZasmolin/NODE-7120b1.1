const logger = require("../logger/index");
const { User } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.form = (req, res) => {
  res.render("registerForm", { title: "Register" });
};

exports.submit = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      logger.error("Такой пользователь в базе уже существует");
      res.error("Такой пользователь в базе уже существует");
      res.redirect("/");
    } else {
      const salt = await bcrypt.hash(req.body.password, 10);
      const hash = await bcrypt.hash(req.body.password, salt);
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        age: req.body.age,
        isAdmin: req.body.isAdmin,
      });
      req.session.userEmail = req.body.email;
      req.session.userName = req.body.name;
      logger.info("Создался новый пользователь");
      //jwt generation
      const jwtTime = process.env.JWTTIME;
      const token = jwt.sign(
        {
          name: req.body.name,
        },
        process.env.JWTTOKENSECRET,
        {
          expiresIn: jwtTime,
        }
      );
      // создание cookie для пользователя
      res
        .cookie("jwt", token, { httpOnly: true, maxAge: jwtTime })
        .redirect("/");
      logger.info(`Создан новый токен для ${req.body.email}, Токен: ${token}`);
    }
  } catch (error) {
    logger.error(`Произошла ошибка: ${error}`);
    return next(error);
  }
};
