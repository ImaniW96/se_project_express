const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
// the /users routes
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
module.exports = router;

 
