const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
//models
const User = require("../../../models/User.js");
const createToken = require("../../../utils/createToken.js");

router.get("/userId/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route in /users/:id (GET):");
  // console.log("req.user:", req.user);
  const userId = req.params.id;
  // console.log("userId:", userId);
  // console.log(
  //   "mongoose.Types.ObjectId.isValid(id):",
  //   mongoose.Types.ObjectId.isValid(userId)
  // );
  if (userId !== undefined) {
    try {
      const user = await User.findById(userId).select("-hash -salt");
      // console.log("user in /users:id (GET):", user);
      const { accessToken } = await createToken(user);
      // console.log("accessToken in /users:id (GET):", accessToken);
      res.status(200).json({ token: accessToken });
    } catch (error) {
      console.log("error in catch:", error);
      return res.status(400).json({ message: "somethings went wrong" });
    }
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
