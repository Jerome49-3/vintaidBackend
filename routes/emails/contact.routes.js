const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();
const sendEmailContact = require("../../utils/sendEmailContact");
const fileUpload = require("express-fileupload");

router.post("/contact", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route /contact (POST)");
  const { messageContact, subject, numberCommand, numberOffer } = req.body;
  console.log(
    "messageContact",
    messageContact,
    "\n",
    "subject",
    subject,
    "\n",
    "numberCommand",
    numberCommand,
    "\n",
    "numberOffer",
    numberOffer
  );
  const username = req?.user?.account?.username;
  console.log("username in /contact:", username);
  const email = req.user.email;
  console.log("email in /contact:", email);
  if (!messageContact || !subject) {
    res.status(400).json("oups a field missing");
  }
  if (messageContact && subject) {
    res.status(200).json({ message: "Votre message à bien été publié" });
    try {
      const mailSend = await sendEmailContact(
        username,
        email,
        subject,
        messageContact
      );
      console.log("mailSend:", mailSend);
    } catch (error) {
      console.log("error:", error);
    }
  }
  try {
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
