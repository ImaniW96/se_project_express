// middlewares/auth.js

const jwt = require("jsonwebtoken");
const { NOT_AUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    // we return an error if something goes wrong
    return res
      .status(NOT_AUTHORIZED)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
  // save the payload to req.user
  // call next method
};
