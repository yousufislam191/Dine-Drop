const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const app = express();

require("./config/db");
const userRouter = require("./routes/user.routes");
const seedRouter = require("./routes/seed.routes");
const { errorResponse } = require("./controllers/response.controller");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP. Please try again later",
});

app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173/" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(xssClean());
app.use(limiter);

app.use("/api/user", userRouter);
app.use("/api/seeduser", seedRouter);

// app.get("/", (req, res) => {
//   res.status(200).send("server home route");
// });

// client error handling
app.use((req, res, next) => {
  next(createError(404, "Page Not Found "));
});

// server error handling --> all errors handeled finally
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
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
