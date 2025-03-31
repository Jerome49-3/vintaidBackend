const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User.js");

router.get("/myOffers", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /myOffers");
  const user = req.user;
  console.log("user on /myOffers:", user);
  const userId = user._id;
  console.log("userId on /myOffers:", userId);
  const userAccount = user.account;
  console.log("userAccount on /myOffers:", userAccount);
  const userOffers = await Offer.find({ owner: userId }).populate({
    path: "owner",
    select: "account",
  });
  console.log("userOffers on /myOffers:", userOffers);
  res.status(200).json(userOffers);
});

module.exports = router;
