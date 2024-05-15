const JwtStrategy = require("passport-jwt").Strategy;

const User = require("../models/db");
const logger = require("../logger");

require("dotenv").config();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWTTOKENSECRET,
};

function passportFunction(passport) {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findOne(jwt_payload.name);

        if (user) {
          logger.info("Token OK");
          return done(null, user);
        } else {
          logger.info("Token NOT OK");
          return done(null, false);
        }
      } catch (error) {
        logger.error(`Произошла ошибка: ${error}`);
        return next(error, false);
      }
    })
  );
}

module.exports = passportFunction;
