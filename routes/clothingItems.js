const mongoose = require("mongoose");
const router = require("express").Router();
 const express = require("express")
 const {PORT = 3001} = process.env;
 const app = express();

const {getItems, createItem, deleteItem} = require("../controllers/clothingItem")

// the /items routes
router.get('/', getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem); // baseUrl/items/97sdf97sf
module.exports = router;