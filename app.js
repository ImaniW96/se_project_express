const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { logIn, createUser, getCurrentUser } = require('./controllers/users');

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use(express.json());
 
const cors = require("cors");

app.use(cors());
app.post('/signin', logIn);
app.post('/signup', createUser);
// app.get("/users/me", getCurrentUser)
app.use("/", mainRouter);

// 1. this should go in routes/users.js

app.listen(PORT, () => {
  console
    .log(`Server is running on port ${PORT}`)
});
 