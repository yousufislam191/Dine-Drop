const {
  createNewUser,
  activateCreatedUser,
  userSignInController,
  verifyToken,
  getUser,
  refreshToken,
} = require("../controllers/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator, signInValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.post("/register", signUpValidator, validationHandler, createNewUser);
userRouter.get("/email-activate", activateCreatedUser);
userRouter.post(
  "/signin",
  signInValidator,
  validationHandler,
  userSignInController
);
userRouter.get("/fetch-user", verifyToken, getUser);
userRouter.get("/refresh", refreshToken, verifyToken, getUser);

userRouter.get("/", getUser);

module.exports = userRouter;
