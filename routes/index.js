const router = require("express").Router();

const userRouter = require("./users");
// const logIn = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND, handleErrors } = require("../utils/errors");

// router.use('/logIn', logIn)
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  const error = new error();
  error.name = "DocumentNotFoundError";
  handleErrors(error, next);
});
// throw new NotFound("Route not found");

module.exports = router;
