const createError = require("http-errors");
const JWT = require("jsonwebtoken");

const User = require("../models/users.model");
const { successResponse } = require("./response.controller");
const { findWithId } = require("../services/findWithId");
const { deleteImage } = require("../helper/deleteImage");
const { createJWT } = require("../helper/createJWT");
const {
  jwtActivationKey,
  clientURL,
  appName,
  expireJwtForActivateAccount,
} = require("../secret");
const sendEmailWithNodamailer = require("../helper/email");

// GET all user by admin
const getUser = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      role: { $ne: 1 }, //if role = 1 that means it is admin, so it will not be able to retun
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    // which we don't want to return for get request
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    // total documents count
    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "User not found");

    return successResponse(res, {
      statusCode: 200,
      message: "Users were retured successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET user by ID
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User was retured successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE user
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    // user image deleted
    const userImagePath = user.image;
    deleteImage(userImagePath);

    const deleteUser = await User.findOneAndDelete({
      _id: id,
      role: { $ne: 1 },
    });
    if (!deleteUser)
      throw createError(
        404,
        "This user will never be deleted. Before being deleted, you have to make another user an admin."
      );
    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// for create new user and send email activation notification
const createNewUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User already exists. Please sign in");
    }

    // create token
    const token = createJWT(
      { name, email, password, phone, address },
      jwtActivationKey,
      expireJwtForActivateAccount
    );

    //prepare email
    const emailData = {
      email,
      subject: `Activate your ${appName} Account`, // Subject line
      text: "Verify your account", // plain text body
      html: `
    <h2>Hello ${name}</h2>
    <h3>Thanks for registering ${appName} account</h3>
    <h4>Please click here to <a href="${clientURL}/api/activate/${token}" target="_blank">activate your account</a>. The Link will be expire after ${expireJwtForActivateAccount}.</h4>
    `, // html body
    };

    // send activation email
    try {
      // await sendEmailWithNodamailer(emailData);
    } catch (error) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `A verification email has been sent to this email ${email}. Please go to your email to complete your registration process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// for activate user account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found");

    try {
      const decodedToken = JWT.verify(token, jwtActivationKey);
      if (!decodedToken)
        throw createError(401, "Unable to verify user account");

      const userExists = await User.exists({ email: decodedToken.email });
      if (userExists) {
        throw createError(409, "User already exists. Please sign in");
      }

      await User.create(decodedToken);

      return successResponse(res, {
        statusCode: 201,
        message: "Your account has been activated successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid JSON Web Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
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
      .json({ message: "User not found!!.. Signup please" });
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

      if (req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = "";
      }

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

// const getUser = async (req, res) => {
//   const userId = req.id;
//   let user;
//   try {
//     user = await User.findById(userId, "-password");
//   } catch (error) {
//     // res.status(500).send(error.message);
//     return new Error(error);
//   }
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   return res.status(200).json({ user });
// };

// refresh token and generate new token
const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const previousToken = cookies.split("=")[2];

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
  refreshToken,
  getUser,
  getUserById,
  deleteUserById,
  activateUserAccount,
};
