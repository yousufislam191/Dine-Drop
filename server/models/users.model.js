const { Schema, model } = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [40, "Name should not exceed 40 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: 8,
      validate: isStrongPassword,
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minLength: [11, "Phone number must be a valid number"],
      maxLength: [11, "Phone number must be a valid number"],
      match: /\d{11}/,
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      required: [true, "Street address is required"],
      minLength: 5,
    },
    role: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("users", userSchema);
