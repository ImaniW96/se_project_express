const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  DEFAULT,
  OKAY_REQUEST,
  CREATE_REQUEST,
  NOT_FOUND,
  DUPLICATE_ERROR,
  NOT_AUTHORIZED,
} = require("../utils/errors");
const JWT_SECRET = "some-secret-key";

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(OKAY_REQUEST).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res.status(DEFAULT).send({ message: err.message });
//     });
// };

// This can become getCurrentUser
// instead of getting ID from params
// you get from req.user
const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OKAY_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  // do check for name, avatar, email, password

  // check the database for the email. If it already exists, throw an error.
  // User.findOne({ email })

  //   .then((user) => {
  //     if (user) {
  //       res.status(DUPLICATE_ERROR).send({ message: "Duplicate error" });
  //       throw error;
  //     }
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      return res.status(CREATE_REQUEST).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(DUPLICATE_ERROR).send({ message: "Duplicate error" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).send({ message: "An error has occured" });
    });
};
const logIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "email and password are required" });
  }

  User.findOne({ email })
    .then((user) => {
      console.log(">>>", user);
      if (!user) {
        return res
          .status(NOT_AUTHORIZED)
          .send({ message: "Please enter a valid email or password" });
      }
      // if (!user.id || !JWT_SECRET){
      //   return res.status(DEFAULT).send({message:"Internal server error"})
      // }

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
    })
    .catch((err) => {
      return res.status(DEFAULT).send({ message: "failed to log in" });
    });
};
const updateUser = (req, res) => {
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
    .catch((error) =>
      res.send({ message: "Data validation failed or another error occured." })
    );
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
