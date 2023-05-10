const { validationResult } = require("express-validator");

exports.validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  //   console.log(errors.mapped());
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};
