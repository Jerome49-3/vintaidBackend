const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();
const sendEmailContact = require("../../utils/sendEmailContact");
const fileUpload = require("express-fileupload");
const Contact = require("../../models/Contact");
const User = require("../../models/User");
const moment = require("moment/moment.js");

router.post("/contact", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route /contact (POST)");
  const { messageContact, subject, numberCommand, numberOffer } = req.body;
  const reqUser = req.user;
  // console.log("reqUser in /contact:", reqUser);
  const userId = reqUser._id;
  // console.log("userId in /contact:", userId);
  const user = await User.findById(userId);
  // console.log("user in /contact:", user);
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
  const username = user?.account?.username;
  console.log("username in /contact:", username);
  const dateSendedContact = moment().format("L");
  console.log("dateSendedContact in /contact:", dateSendedContact);
  const email = user?.email;
  console.log("email in /contact:", email);
  if (!messageContact || !subject) {
    res.status(400).json("oups a field missing");
  }
  if (messageContact && subject) {
    try {
      const mailSend = await sendEmailContact(
        username,
        email,
        subject,
        messageContact
      );
      console.log("mailSend:", mailSend);
      const newContact = new Contact({
        categorie: subject,
        messageContact: messageContact,
        owner: userId,
        date: dateSendedContact,
      });
      console.log("newContact:", newContact);
      await newContact.save();
      return res
        .status(200)
        .json({ message: "Votre message à bien été envoyé" });
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
