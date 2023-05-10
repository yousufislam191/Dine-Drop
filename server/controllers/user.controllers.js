const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const User = require("../models/users.model");
const sendEmail = require("./sendEmail.controllers");
const emailMessage = require("../models/mail.models");

// for create new user and send email activation notification
const createNewUser = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  const token = JWT.sign(
    { name, email, password, phone, address, role },
    process.env.USER_ACCOUNT_ACTIVATE_KEY,
    { expiresIn: "5m" }
  );

  try {
    const info = await sendEmail(emailMessage(email, token));
    // console.log(`"Accepted message: " ${info.accepted}`);
    if (info.accepted) {
      return res.status(200).send({
        message: `A verification email has been sent to this email ${email} .
        Verification email will be expire after 5 Minutes.`,
        token: token,
      });
    } else {
      res.status(500).send({
        // error: error.message,
        message: "Email not sent Please try again!!",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message: "Something error. Please try again!!",
    });
  }
};

// activated user and save user info in database
const activateCreatedUser = async (req, res) => {
  const token = req.query.token;
  // try {
  //   return res.status(200).send({ token: token });
  // } catch (error) {
  //   return res.status(500).send({ message: error.message });
  // }
  if (token) {
    JWT.verify(
      token,
      process.env.USER_ACCOUNT_ACTIVATE_KEY,
      (err, decodedToken) => {
        if (err) {
          return res.status(400).json({ message: "Link has been expired." });
        }
        const { name, email, password, phone, address, role } = decodedToken;
        const hashpassword = bcrypt.hashSync(password);
        const newUser = new User({
          name,
          email,
          password: hashpassword,
          phone,
          address,
          role,
        });
        try {
          newUser.save();
          return res.status(201).json([{ message: "Activated your account." }]);
        } catch (error) {
          return res.status(500).send({
            message: error.message,
            // errors,
          });
        }
      }
    );
  } else {
    return res.status(500).json({ error: "Something went wrong!!!" });
  }
};

// for signin
const userSignInController = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User not found!!.. Regester please" });
  } else {
    const isPasswordMatches = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordMatches) {
      return res.status(400).json({ message: "Wrong email and password" });
    } else {
      const token = JWT.sign(
        {
          id: existingUser._id,
          name: existingUser.name,
        },
        process.env.USER_LOGIN_KEY,
        { expiresIn: "35s" }
      );
      // console.log("Generated token\n", token);

      // if (req.cookies[`${existingUser._id}`]) {
      //   req.cookies[`${existingUser._id}`] = "";
      // }

      res.cookie(String(existingUser._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 30), // 30 seconds
        httpOnly: true,
        sameSite: "lax",
      });
      return res
        .status(200)
        .json({ message: "User signin successfully !!", token: token });
    }
  }
};

// when user login then firstly verify token then redirect
const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  // console.log(token);
  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }
  JWT.verify(String(token), process.env.USER_LOGIN_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token", token: token });
    }
    // console.log(user.id);
    req.id = user.id;
  });
  next();
};

const getUser = async (req, res) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    // res.status(500).send(error.message);
    return new Error(error);
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user });
};

// refresh token and generate new token
const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const previousToken = cookies.split("=")[1];

  if (!previousToken) {
    return res.status(400).json({ message: "Token not found" });
  }

  JWT.verify(String(previousToken), process.env.USER_LOGIN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Authentication Failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = JWT.sign(
      {
        id: user.id,
      },
      process.env.USER_LOGIN_KEY,
      { expiresIn: "35s" }
    );
    // console.log("Regenerated token", token);
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });
    req.id = user.id;
    next();
  });
};

module.exports = {
  createNewUser,
  activateCreatedUser,
  userSignInController,
  verifyToken,
  getUser,
  refreshToken,
};
