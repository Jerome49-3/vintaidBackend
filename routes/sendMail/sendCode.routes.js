const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const User = require("../../models/User");

//utils
const sendEmail = require("../../utils/sendEmail");

router.post("/sendCode", async (req, res) => {
  console.log("je suis sur la route sendCode (POST)");

  const { email } = req.body;
  console.log("email in /sendCode:", email);
  const user = await User.find({ email: email });
  console.log("user in /sendCode:", user);

  try {
    // Votre logique ici
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
