require("dotenv").config();

const serverPort = process.env.PORT || 5200;

const mongodbUrl = process.env.DB_URL || "mongodb://localhost:27017/dineDrop";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpg";

module.exports = { serverPort, mongodbUrl, defaultImagePath };
