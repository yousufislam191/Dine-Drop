require("dotenv").config();

const serverPort = process.env.PORT || 5200;

const mongodbUrl = process.env.DB_URL || "mongodb://localhost:27017/dineDrop";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpg";

const jwtActivationKey =
  process.env.USER_ACCOUNT_ACTIVATE_KEY || "jhgUYFD76^$%t654U&b_@#";

const expireJwtForActivateAccount =
  process.env.USER_ACCOUNT_JWT_EXPIRE_TIME || "5m";

const smtpUserName = process.env.SMTP_USERNAME || "";

const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";
const appName = process.env.APP_NAME || "";

module.exports = {
  serverPort,
  mongodbUrl,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  appName,
  expireJwtForActivateAccount,
};
