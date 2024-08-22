const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { logIn, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use(express.json());

app.use(cors());
app.post("/signin", logIn);
app.post("/signup", createUser);

app.use("/", mainRouter);

// 1. this should go in routes/users.js

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
