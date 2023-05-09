const { createNewUser } = require("../controllers/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator } = require("../middleware/userAuth");

const router = require("express").Router();

router.post("/register", signUpValidator, validationHandler, createNewUser);

module.exports = router;
