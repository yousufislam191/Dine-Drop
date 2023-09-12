const { validationResult } = require("express-validator");
const path = require("path");
const { errorResponse } = require("../controllers/response.controller");
const { UPLOAD_USER_IMG_DIRECTORY } = require("../config");
const { deleteImage } = require("../helper/deleteImage");

const validationHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // If the validation fails then file will be deleted
    if (!errors.isEmpty()) {
      if (req.file) {
        deleteImage(path.join(UPLOAD_USER_IMG_DIRECTORY, req.file.filename));
      }

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
