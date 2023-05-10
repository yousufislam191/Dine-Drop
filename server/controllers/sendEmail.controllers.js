const nodemailer = require("nodemailer");

const sendEmail = async (msg) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail(msg);
    return info;
  } catch (error) {
    return error;
  }
};
module.exports = sendEmail;
