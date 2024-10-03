const JWT_SECRET = require("../utils/config");
const jwt = require("jsonwebtoken");
const { NOT_AUTHORIZED } = require("../utils/errors");
const Error = require("../utils/errors");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }
  next(new Error.NotAuthorized("Authorization required"));

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // we return an error if something goes wrong
    return res
      .status(NOT_AUTHORIZED)
      .send({ message: "Authorization required" });
  }
  next(new Error.NotAuthorized("Authorization required"));
  req.user = payload;
  return next();
  // save the payload to req.user
  // call next method
};
