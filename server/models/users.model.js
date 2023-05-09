const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate: isStrongPassword,
    },
    phone: {
      type: Number,
      required: true,
      minLength: 11,
      maxLength: 11,
      match: /\d{11}/,
    },
    address: {
      type: String,
      required: true,
      minLength: 5,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
