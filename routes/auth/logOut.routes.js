const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();

router.post("/logout", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /logOut (POST)");
  const user = req.user;
  console.log("user in logout:", user);

  try {
    user.isOnline = false;
    await user.save();
    if (!user.isOnline) {
      res.clearCookie("accessTokenV", { path: "/" });
      res.clearCookie("refreshTokenV", { path: "/" });
      // res.clearCookie("VintaidAppCookiesAccept", { path: "/" });
      // res.clearCookie("vintaidAppTheme", { path: "/" });
      res.status(200).json({ message: "Logged out" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
