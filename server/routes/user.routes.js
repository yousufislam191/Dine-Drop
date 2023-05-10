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

const router = require("express").Router();

router.post("/register", signUpValidator, validationHandler, createNewUser);
router.get("/email-activate", activateCreatedUser);
router.post(
  "/signin",
  signInValidator,
  validationHandler,
  userSignInController
);
router.get("/fetch-user", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);

module.exports = router;
