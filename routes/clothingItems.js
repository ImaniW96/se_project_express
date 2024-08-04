
const router = require("express").Router();
const {getItems, createItem, deleteItem, likeItem, deleteLike} = require("../controllers/clothingItem")

// the /items routes
router.get('/', getItems);
router.post("/", createItem);
router.put('/:itemId/likes',likeItem);
router.delete('/:itemId/likes',deleteLike)
router.delete("/:itemId", deleteItem); // baseUrl/items/97sdf97sf
module.exports = router;