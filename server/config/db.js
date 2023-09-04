const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbUrl, options);
    console.log("Database connection established successfully");

    mongoose.connection.on("error", (err) =>
      console.error("Database connection error: ", err)
    );
  } catch (error) {
    console.error("Could not connect to Database: ", error.toString());
  }
};
module.exports = connectDB;
