const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const User = require("../../models/User");

//utils
const sendEmail = require("../../utils/sendEmail");

router.post("/sendCode/:id", async (req, res) => {
  console.log("je suis sur la route /sendCode/:id (POST)");
  try {
    const id = req.params.id;
    console.log("id on /sendEmailCode/:id:", id);
    const user = await User.findById(id);
    if (user) {
      await sendEmail(user);
      res
        .status(200)
        .json({ message: "le code a bien été renvoyé à l'utilisateur" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
