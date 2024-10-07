const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const { celebrate } = require("celebrate");
const cors = require("cors");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;
const { errors } = require("celebrate");
const { logIn, createUser } = require("./controllers/users");
const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use(express.json());
app.use(requestLogger);

app.use(cors());
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.post("/signin", validateAuthentication, logIn);
app.post("/signup", validateUserBody, createUser);

app.use("/", mainRouter);

// app.use(routes);
app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler
// app.use(errorHandler);
app.use((error, req, res) =>
  res.status(error.statusCode).send({ message: error.message })
);

// 1. this should go in routes/users.js

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
