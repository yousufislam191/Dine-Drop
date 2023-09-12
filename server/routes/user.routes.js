const {
  createNewUser,
  activateCreatedUser,
  userSignInController,
  verifyToken,
  getUser,
  refreshToken,
  getUserById,
  deleteUserById,
  activateUserAccount,
} = require("../controllers/user.controllers");
const { validationHandler } = require("../middleware");
const { upload } = require("../middleware/uploadFile");
const { signUpValidator, signInValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

// userRouter.post("/register", signUpValidator, validationHandler, createNewUser);
// userRouter.get("/email-activate", activateCreatedUser);
// userRouter.post(
//   "/signin",
//   signInValidator,
//   validationHandler,
//   userSignInController
// );
// userRouter.get("/fetch-user", verifyToken, getUser);
// userRouter.get("/refresh", refreshToken, verifyToken, getUser);

userRouter.post(
  "/register",
  upload.single("image"),
  signUpValidator,
  validationHandler,
  createNewUser
);
userRouter.post("/verify-account", activateUserAccount);
userRouter.get("/", getUser);
userRouter.get("/:id([0-9a-fA-F]{24})", getUserById);
userRouter.delete("/:id([0-9a-fA-F]{24})", deleteUserById);

module.exports = userRouter;
