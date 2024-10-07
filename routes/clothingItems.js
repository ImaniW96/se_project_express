const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingItem");
// requrie auth middleware
const auth = require("../middlewares/auth");

// the /items routes
router.get("/", getItems);

// auth protected routers
router.use(auth);
router.post("/", validateCardBody, createItem); // validateCardBody
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, deleteLike);
router.delete("/:itemId", validateId, deleteItem); // baseUrl/items/97sdf97sf
module.exports = router;
