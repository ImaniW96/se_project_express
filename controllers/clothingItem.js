const ClothingItem = require("../models/clothingItem");
const { handleErrors } = require("../utils/errors");
const { OKAY_REQUEST, CREATE_REQUEST } = require("../utils/errors");
const { DEFAULT } = require("./users");
const BadRequestError = require("../errors/BadRequstError");
const { ForbiddenError } = require("../errors/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || name.length < 2) {
    throw new BadRequestError("Invalid data");
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

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OKAY_REQUEST).send(items))
    .catch((e) => {
      console.error(e);
      return next(new DEFAULT("server error"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("You are not allowed to delete this"));
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      handleErrors(err, next);
    });
};
const likeItem = (req, res, next) => {
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

const deleteLike = (req, res, next) => {
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
      handleErrors(err, next);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, deleteLike };
