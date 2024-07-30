const router = require("express").Router();
 
const userRouter = require("./users");
const clothingItemRouter =require('./clothingItems')

router.use("/users", userRouter);
router.use("/items", clothingItemRouter)
// router.use("./items/:itemId", clothingItemRouter)
module.exports = router;