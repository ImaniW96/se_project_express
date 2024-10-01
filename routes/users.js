const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserBody } = require("../middlewares/validation");
// the /users routes
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser)
router.use(auth);
router.get("/me", validateUserBody, getCurrentUser);
router.patch("/me", validateUserBody, updateUser);

module.exports = router;
