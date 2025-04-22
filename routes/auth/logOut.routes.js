const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();

const User = require("../../models/User");

router.post("/logout", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /logOut (POST)");
  const reqUser = req.user;
  console.log("reqUser in logout:", reqUser);
  const userId = reqUser._id;
  console.log("userId in logout:", userId);
  console.log(
    "req.user instanceof mongoose.Model:",
    req.user instanceof mongoose.Model
  );
  const user = await User.findById(userId).select("-hash -salt");

  try {
    user.isOnline = false;
    await user.save();
    if (!user.isOnline) {
      res.clearCookie("accessTokenV", { path: "/" });
      res.clearCookie("refreshTokenV", { path: "/" });
      // res.clearCookie("VintaidAppCookiesAccept", { path: "/" });
      // res.clearCookie("vintaidAppTheme", { path: "/" });
      console.log("user in logout:", user);
      res.status(200).json({ message: "Logged out" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
