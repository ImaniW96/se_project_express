const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { findById } = require("../models/user");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => {
      return res.status(201).send(item);
    })
    .catch((e) => {
        console.log(e.name)
      return res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error can not getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => {
      return res.status(200).send({ message: "Item has been deleted" });
    })
    .catch((err) => {
      console.error(err);
    });
};

// const mongoose = require("mongoose");

// const clothingItemSchema = new mongoose.Schema({});

module.exports = { getItems, createItem, deleteItem };
