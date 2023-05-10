const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./config/db");

const userRouter = require("./routes/user.routes");

const app = express();
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173/" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//   res.status(200).send("server home route");
// });
app.use((req, res, next) => {
  res.status(404).send("Page not found");
  res.end();
});
app.use((err, req, res, next) => {
  if (res.headersSent) {
    next("There was a problem!");
  } else {
    if (err.message) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Server error !!!");
    }
  }
});

module.exports = app;
