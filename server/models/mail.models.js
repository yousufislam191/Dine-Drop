const emailMessage = (email, token) => {
  return {
    from: `"Dine Drop "${process.env.SENDER_EMAIL}`, // sender address
    to: email, // list of receivers
    subject: "Verify your account", // Subject line
    text: "Verify your account", // plain text body
    html: `
    <h3>Thanks for registering Dine Drop</h3>
    <h4>Please verify your email to continue...<a href="http://localhost:5000/api/email-activate?token=${token}">verify your email</a></h4>
    `, // html body
  };
};
module.exports = emailMessage;

// <p>${process.env.CLIENT_URL}/authentication/activation/${token}</p>
