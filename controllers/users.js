const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("winston");
const JWT_SECRET = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  DEFAULT,
  OKAY_REQUEST,
  CREATE_REQUEST,
  NOT_FOUND,
  DUPLICATE_ERROR,
  NOT_AUTHORIZED,
  handleErrors,
} = require("../utils/errors");

// This can become getCurrentUser
// instead of getting ID from params
// you get from req.user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OKAY_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      // if (err.name === "ValidationError" || err.name === "CastError") {
      //   return res.status(BAD_REQUEST).send({ message: err.message });
      // }
      // if (err.name === "DocumentNotFoundError") {
      //   return res.status(NOT_FOUND).send({ message: err.message });
      // }
      // return res.status(DEFAULT).send({ message: err.message });
      handleErrors(err, next);
    });
};
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(CREATE_REQUEST).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((error) => {
      handleErrors(error, next);
      // if (err.code === 11000) {
      //   return res.status(DUPLICATE_ERROR).send({ message: "Duplicate error" });
      // }
      // if (err.name === "ValidationError") {
      //   return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // return res.status(DEFAULT).send({ message: "An error has occured" });
    });
};
const logIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid data");
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        // return res
        //   .status(NOT_AUTHORIZED)
        //   .send({ message: "Please enter a valid email or password" });
        throw new NotAuthorized("NotAuthorizedError");
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          // const error = new Error();
          // error.name = "NotAuthorizedError";
          // throw error;
          // handleErrors(err, next);
          throw new NotAuthorized("NotAuthorizedError");
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(OKAY_REQUEST).send({
          token,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        });
      });
    })
    .catch((err) => handleErrors(err, next));
};
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },

    // pass the options object:
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.error(e.name);
      handleErrors(error, next);
    });
};

module.exports = {
  // getUsers,
  createUser,
  getCurrentUser,
  logIn,
  updateUser,
  BAD_REQUEST,
  DEFAULT,
  OKAY_REQUEST,
  CREATE_REQUEST,
  NOT_FOUND,
};

// when a user signs up on the frontend we fetch to the backend:
// fetch(url, {
//   headers: {
//     authorization:
//   },
//   body: {
//     name:
//     email:
//     password:
//     avatar:
//   }
// })
//
