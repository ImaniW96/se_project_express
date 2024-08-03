const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { findById } = require("../models/user");
const { NOT_FOUND, OKAY_REQUEST, CREATE_REQUEST } = require("../utils/errors");
const { BAD_REQUEST, DEFAULT } = require("./users");

// const createItem = (req, res) => {
//   const { name, weather, imageUrl } = req.body;
//   ClothingItem.create({
//     name,
//     weather,
//     imageUrl,
//     owner: req.user._id
//   })
//    .then((item) => {
//       return res.status(201).send(item);
//     })
//     .catch((e) => {
//         console.log(e.name)
//         if (!name || name.length < 2) {
//             return res.status(400).send({ message: "The 'name' field must be at least 2 characters long." });
//           }
    
          
//       return res.status(500).send({ message: "Error from createItem", e });
      
//     });
// };
const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    if (!name || name.length < 2) {
      return res.status(BAD_REQUEST).send({ message: "The 'name' field must be at least 2 characters long." });
    }
    ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id
    })
      .then((item) => {
        return res.status(CREATE_REQUEST).send(item);
      })
      .catch((e) => {
        console.error(e.name);  
        if (e.name === "ValidationError") {
          return res.status(BAD_REQUEST).send({ message: "Validation error: " });
        } else if (e.name === "MongoError" && e.code === 11000) {
          return res.status(NOT_FOUND).send({ message: "Duplicate key error: " });
        } else {
         
          return res.status(DEFAULT).send({ message: "Internal Server Error: "});
        }
      });
  };

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OKAY_REQUEST).send(items))
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error can not getItems" });
    });
};

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   ClothingItem.findByIdAndRemove(itemId)
//     .orFail()
//     .then((item) => {
//       return res.status(200).send({ message: "Item has been deleted" });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "CastError") {
//         // send a 400 respose

//       }if else(
//          (err.name === "DocumentNotFoundError") {
//             //// send the 404 error
//             }
//       )
//     });
// };
const deleteItem = (req, res) => {
    const { itemId } = req.params;
    ClothingItem.findByIdAndRemove(itemId)
      .orFail()
      .then((item) => {
        return res.status(OKAY_REQUEST).send({ message: "Item has been deleted" });
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "CastError") {
          return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
        } else if (err.name === "DocumentNotFoundError") {
          return res.status(NOT_FOUND).send({ message: "Item not found" });
        } else {
          return res.status(DEFAULT).send({ message: "An unexpected error occurred" });
        }
      });
  };


const likeItem = (req, res) => {
    const { itemId } = req.params;
    ClothingItem.findByIdAndUpdate(itemId, {
        $addToSet: { likes:req.user._id } },
        {new:true},
    )
      .orFail()
      .then((item) => {
        return res.status(OKAY_REQUEST).send({ message: "Item has been deleted" });
      })
      .catch((err) => {
        if (err.name == 'CastError'){
            return res.status(BAD_REQUEST).send({message: err.message})
        } else if (err.name ==='DocumentNotFoundError'){
          return res.status(NOT_FOUND).send({message:err.message});
        }
        return res.status(DEFAULT).send({message:err.message});
      });
  };

  const deleteLike = (req, res) => {
    const { itemId } = req.params;
    ClothingItem.findByIdAndUpdate(itemId, {
        $pull: { likes:req.user._id } },
        {new:true},
    )
      .orFail()
      .then((item) => {
        return res.status(OKAY_REQUEST).send({ message: "Item has been deleted" });
      })
      .catch((err) => {
        if (err.name == 'CastError'){
            return res.status(BAD_REQUEST).send({message: err.message})
        } else if (err.name ==='DocumentNotFoundError'){
          return res.status(NOT_FOUND).send({message:err.message});
        }
        return res.status(DEFAULT).send({message:err.message});
      });
  };


//   likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
//     { new: true },
//   )
//   //...
  
//   module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } }, // remove _id from the array
//     { new: true },
//   )
// const mongoose = require("mongoose");

// const clothingItemSchema = new mongoose.Schema({});

module.exports = { getItems, createItem, deleteItem, likeItem, deleteLike };
