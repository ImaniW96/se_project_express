const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
// const { NOT_AUTHORIZED, NotAuthorized } = require("../utils/errors");
const { NotAuthorized } = require("../errors/NotAuthorized");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new NotAuthorized("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // we return an error if something goes wrong
    return next(new NotAuthorized("Authorization required"));
  }

  req.user = payload;
  return next();
  // save the payload to req.user
  // call next method
};
