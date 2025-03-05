const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../../../models/Contact");
const router = express.Router();

router.get("/messagesContact", async (req, res) => {
  console.log("je suis sur la route messagesContact (GET)");

  try {
    const findMssgContact = await Contact.find().populate({
      path: "owner",
      select: "account email",
    });
    console.log("findMssgContact in /messagesContact:", findMssgContact);
    res.status(200).json(findMssgContact);
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
