const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);
const generateCode = require("./generateCode");

const sendEmail = async (username, email, messageContact, subject) => {
  console.log("user on sendMail:", user);
  console.log("code on sendMail:", code);
  console.log("username on sendMail:", username);
  console.log("email on sendMail:", email);
  try {
    const admin = `Vintaid team`;
    const subject = "Welcome to Vintaid, my replica of Vinted";
    const message = `Welcome ${username}, ${messageContact}, ${admin}`;
    const messageHtml = `
        <p>Welcome ${username}</p>
        <br>
        <p>${messageContact}</p>
        <br>
        <p>Best regards,</p>
        <strong>${admin}</strong>`;
    const emailSend = await resend.emails.send({
      from: `${username} <${email}>`,
      to: process.env.EMAIL_TO_ME,
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
