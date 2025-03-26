const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
const createToken = require("../../../utils/createToken.js");

//models
const User = require("../../../models/User.js");

router.get("/profile/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /profile (GET)");
  const userId = req.params.id;
  console.log("userId:", userId);
  const user = await User.findById(userId);
  console.log("user in /profile/:id:", user);
  const { accessToken } = await createToken(user);
  console.log("accessToken in /profile/:id:", accessToken);
  try {
    if (!user) {
      res.send(401).json({ message: "unauthorized: please login" });
    } else {
      res.status(200).json({ token: accessToken });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
