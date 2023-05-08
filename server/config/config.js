require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 5200,
  },
  db: {
    url: process.env.DB_URL || "mongodb://localhost:27017/dineDrop",
  },
};
module.exports = dev;
