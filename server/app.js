const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const app = express();

require("./config/db");
const userRouter = require("./routes/user.routes");

app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173/" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//   res.status(200).send("server home route");
// });

// client error handling
app.use((req, res, next) => {
  next(createError(404, "Page Not Found "));
});

// server error handling --> all errors handeled finally
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
  // if (res.headersSent) {
  //   next("There was a problem!");
  // } else {
  //   if (err.message) {
  //     res.status(500).send(err.message);
  //   } else {
  //     res.status(500).send("Server error !!!");
  //   }
  // }
});

module.exports = app;
