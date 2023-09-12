const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/response.controller");

const validationHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.mapped());
      return errorResponse(res, {
        statusCode: 422,
        message: errors.mapped(),
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { validationHandler };
