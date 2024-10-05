const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUser } = require("../middlewares/validation");

// the /users routes
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser)
router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateUser);

module.exports = router;
