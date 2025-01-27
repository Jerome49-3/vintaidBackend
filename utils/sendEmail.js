const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (user, username, email, code) => {
  console.log("code on sendMail:", code);
  console.log("user on sendMail:", user);
  console.log("username on sendMail:", username);
  console.log("email on sendMail:", email);
  try {
    const admin = `Vintaid team`;
    const subject = "Welcome to Vintaid, my replica of Vinted";
    const message = `Welcome ${username}, Here your code: ${code}, copy him and tape it at input for verifying your email, please`;
    const messageHtml = `
        <p>Welcome ${username},</p>
        <p>Welcome ${username}, Here your code: ${code}, copy him and tape it at input for verifying your email, please</p>
        <br>
        <p>Best regards,</p>
        <strong>${admin}</strong>`;
    const emailSend = await resend.emails.send({
      from: process.env.EMAIL_TO_ME,
      to: `${username} <${email}>`,
      subject: subject,
      text: message,
      html: messageHtml,
    });
    return emailSend;
  } catch (error) {
    console.log("error:", error);
  }
};
module.exports = sendEmail;
