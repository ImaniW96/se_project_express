const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST,
  DEFAULT,
  OKAY_REQUEST,
  CREATE_REQUEST,
  NOT_FOUND,
  DUPLICATE_ERROR,
} = require("../utils/errors");
const JWT_SECRET = "some secret key";

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OKAY_REQUEST).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: err.message });
    });
};

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

  // check the database for the email. If it already exists, throw an error.
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        return res.status(DUPLICATE_ERROR).send({ message: "Duplicate error" });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(DUPLICATE_ERROR).send({ message: "Duplicate error" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).send({ message: "An error has occured" });
    });

  // const { name, avatar, email, password } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};
const logIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: "Please enter a valid email or password" });
      }
      // if (!user.id || !JWT_SECRET){
      //   return res.status(DEFAULT).send({message:"Internal server error"})
      // }

      const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        token,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      return res.status(DEFAULT).send({});
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  logIn,
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
