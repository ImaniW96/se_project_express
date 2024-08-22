const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  OKAY_REQUEST,
  CREATE_REQUEST,
  NOT_AUTHORIZED,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const { BAD_REQUEST, DEFAULT } = require("./users");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || name.length < 2) {
    return res.status(BAD_REQUEST).send({
      message: "The 'name' field must be at least 2 characters long.",
    });
  }
  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(CREATE_REQUEST).send(item))
    .catch((e) => {
      console.error(e.name);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Validation error: " });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error: " });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OKAY_REQUEST).send(items))
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT).send({ message: "Error can not getItems" });
    });
};

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   ClothingItem.findByIdAndRemove(itemId)
//     .orFail()
//     .then(() =>
//       res.status(OKAY_REQUEST).send({ message: "Item has been deleted" })
//     )
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "Item not found" });
//       }
//       return res
//         .status(DEFAULT)
//         .send({ message: "An unexpected error occurred" });
//     });
// };
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You are not authorized to delete this" });
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};
const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OKAY_REQUEST).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OKAY_REQUEST).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
  //   const userSchema = new Schema({

  //     password: {
  //       type: String,
  //       required: true,
  //       select: false
  //     },

  //   })
};

// const mongoose = require("mongoose");

// const clothingItemSchema = new mongoose.Schema({});

module.exports = { getItems, createItem, deleteItem, likeItem, deleteLike };
