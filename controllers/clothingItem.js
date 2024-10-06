const Error = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");
const handleErrors = require("../utils/errors");
const {
  NOT_FOUND,
  OKAY_REQUEST,
  CREATE_REQUEST,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const { BAD_REQUEST, DEFAULT } = require("./users");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || name.length < 2) {
    return handleErrors(err, next);
  }
  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(CREATE_REQUEST).send(item))
    .catch((err) => {
      handleErrors(err, next);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OKAY_REQUEST).send(items))
    .catch((e) => {
      console.error(e);
      handleErrors(err, next);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return handleErrors(err, next);
        // next(new Error.ForbiddenError("You are not allowed to delete this"));
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      handleErrors(err, next);
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
      handleErrors(err, next);
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
      handleErrors(res, next);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, deleteLike };
