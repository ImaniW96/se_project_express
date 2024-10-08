const router = require("express").Router();
const userRouter = require("./users");
const { NotFound } = require("../errors/NotFound");
// const logIn = require("./users");
const clothingItemRouter = require("./clothingItems");
// const { NOT_FOUND, handleErrors } = require("../utils/errors");

// router.use('/logIn', logIn)
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use(() => {
  throw new NotFound("Route not found");
});
// throw new NotFound("Route not found");

module.exports = router;
