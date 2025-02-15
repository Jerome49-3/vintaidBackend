const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/logout", async (req, res) => {
  console.log("je suis sur la route /logOut (POST)");

  try {
    res.clearCookie("accessTokenV", { path: "/" });
    res.clearCookie("refreshTokenV", { path: "/" });
    // res.clearCookie("VintaidAppCookiesAccept", { path: "/" });
    // res.clearCookie("vintaidAppTheme", { path: "/" });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
