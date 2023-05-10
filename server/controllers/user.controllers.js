const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const User = require("../models/users.model");

// for create new user and send email activation notification
const createNewUser = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  const newUser = new User({ name, email, password, phone, address, role });

  try {
    return res.status(201).send({
      user: newUser,
      message: "Account Created.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { createNewUser };
