const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);
// console.log("resend on sendMail:", resend);

const generateCode = require("./generateCode");

const sendEmail = async (user) => {
  console.log("user on sendMail:", user);
  const username = user.account.username;
  const email = user.email;
  const code = generateCode(6);
  user.code = code;
  console.log("code on sendMail:", code);
  console.log("username on sendMail:", username);
  console.log("email on sendMail:", email);
  try {
    const admin = `Vintaid team`;
    const subject = "Welcome to Vintaid, my replica of Vinted";
    const message = `Welcome ${username}, Here your code: ${code}, copy him and tape it at input for verifying your email, please`;
    const messageHtml = `
        <p style={{backgroundColor: "#2DB0BA", width: "100%", padding: "20px"}}>Welcome ${username},</p>
        <p>Here's your code: ${code}, please copy and paste it into the entry to check your email.</p>
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
