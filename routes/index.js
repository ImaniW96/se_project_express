const router = require("express").Router();

const userRouter = require("./users");
// const logIn = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

// router.use('/logIn', logIn)
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Route not found" })
);
module.exports = router;
