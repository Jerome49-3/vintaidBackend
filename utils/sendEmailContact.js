const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailContact = async (username, email, subject, messageContact) => {
  console.log("username on sendMail:", username);
  console.log("email on sendMail:", email);
  try {
    const admin = `Vintaid team`;
    const sujet = `${subject}`;
    const message = `Welcome ${admin}, ${messageContact}, ${username}, ${email}`;
    const messageHtml = `
        <p>Welcome ${admin}</p>
        <br>
        <p>${messageContact}</p>
        <br>
        <p>Best regards,</p>
        <strong>${username}</strong>
        <p>${email}<p/>`;
    const emailSend = await resend.emails.send({
      from: `${username} <${process.env.EMAIL_TO_ME}>`,
      to: process.env.EMAIL_TO_ME,
      subject: sujet,
      replyTo: `${email}`,
      text: message,
      html: messageHtml,
    });
    return emailSend;
  } catch (error) {
    console.log("error:", error);
  }
};
module.exports = sendEmailContact;
