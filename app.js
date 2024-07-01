const express = require("express");
const mongoose = require("mongoose");
const mainRouter = required(".routes/index");
const app = express();
const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.listen(PORT, () => {
  console
    .log(`Server is running on port ${PORT}`)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch(console.error);
  app.use("/", mainRouter);
});
