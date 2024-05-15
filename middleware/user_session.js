const { User } = require("../models/db");
module.exports = async function (req, res, next) {
  try {
    if (req.session.userEmail) {
      const user = await User.findOne({
        where: { email: req.session.userEmail },
      });
      if (!user) return next(new Error("User not found"));
      if (user) {
        req.user = res.locals.user = user;
        res.locals.admin = user.isAdmin === 1 ? true : false;
      }
    }
    if (req.session.passport) {
      res.locals.user = req.session.passport.user;
    }
    return next();
  } catch (error) {
    logger.error(`Произошла ошибка: ${error}`);
    return next(error);
  }
};
