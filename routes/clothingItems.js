const { validateCardBody } = require("../middlewares/validation");
const router = require("express").Router();
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
router.post("/", validateCardBody, createItem);
router.put("/:itemId/likes", validateCardBody, likeItem);
router.delete("/:itemId/likes", validateCardBody, deleteLike);
router.delete("/:itemId", validateCardBody, deleteItem); // baseUrl/items/97sdf97sf
module.exports = router;
