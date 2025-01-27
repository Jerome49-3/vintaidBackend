const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const User = require("../../models/User.js");

router.get("/refreshToken", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /refreshToken");
  res.cookie("accessTokenV", accessToken, {
    httpOnly: true,
    secure: false, // mettre à true en prod
    sameSite: "lax", // mettre à strict en prod
    maxAge: 60 * 60 * 1000, // 1h
  });
  res.status(200).json({
    message: "login succesfully",
  });
  return res.status(200).json(transactions);
});

module.exports = router;
