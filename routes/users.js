const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
// the /users routes
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser)
router.get("/users/me", getCurrentUser);
module.exports = router;

 
