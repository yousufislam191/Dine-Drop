const { check } = require("express-validator");
const createError = require("http-errors");

const User = require("../models/users.model");

const signUpValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name should be between 3 and 40 characters")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name should only contain alphabet and space")
    .escape(),
  check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email address")
    .escape()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw createError("Email already exists!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("password must have at least 8 characters")
    .isStrongPassword()
    .withMessage(
      "Password is not a strong. Must be one uppercase, lowercase, number and special characters"
    ),
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is missing")
    .matches(/\d/)
    .withMessage("Phone number must be digits")
    .matches(/^01[3-9][0-9]{8}$/)
    .withMessage("Invalid phone number")
    .isLength({ min: 11 })
    .withMessage("Phone number must have at least 11 digits")
    .isLength({ max: 11 })
    .withMessage("Phone number must have at least 11 digits")
    .escape(),
  check("address")
    .trim()
    .notEmpty()
    .withMessage("Address is missing")
    .isLength({ min: 5 })
    .withMessage("Invalid address"),
  check("image").optional().isString().withMessage("Invalid image"),
];

const signInValidator = [
  check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Invalid password"),
];

module.exports = { signUpValidator, signInValidator };
