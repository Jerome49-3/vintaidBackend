const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// const cookie = require("cookie");
const jwt = require("jsonwebtoken");

//utils
const errorCheckToken = require("../../utils/errorCheckToken.js");

//models
const User = require("../../models/User.js");

router.post("/verifyToken", async (req, res) => {
  // console.log("je suis sur la route /verifyToken (POST)");
  // console.log("req?.headers?.authorization:", req?.headers?.authorization);
  // console.log("req?.headers:", req?.headers);
  // console.log("req?.cookies?.accessTokenV:", req?.cookies?.accessTokenV);
  const bearerToken = await req?.headers?.authorization?.replace("Bearer ", "");
  // console.log("bearerToken in /verifyToken:", bearerToken);
  // console.log(
  //   "req?.cookies?.accessTokenV in /verifyToken:",
  //   req?.cookies?.accessTokenV
  // );
  const cookieAccessToken = await req?.cookies?.accessTokenV;
  // console.log("cookieAccessToken in /verifyToken:", cookieAccessToken);
  try {
    if (bearerToken) {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      // console.log("decoded in /verifyToken:", decoded);
      const user = await User.findById(decoded._id);
      // console.log("user in /verifyToken:", user);

      if (user) {
        res.status(202).json({ message: "Your token is valid" });
      }
    } else {
      const decoded = jwt.verify(cookieAccessToken, process.env.JWT_SECRET);
      // console.log("decoded in /verifyToken:", decoded);
      const user = await User.findById(decoded._id);
      if (user) {
        res.status(202).json({ message: "Your token is valid" });
      }
    }
  } catch (error) {
    const newError = errorCheckToken(error);
    console.log("newError in /verifyToken:", newError);
    if (
      newError.name === "TokenExpiredError" &&
      newError.message === "jwt expired"
    ) {
      res.json({ errorMessage: newError.message });
    }
  }
});

module.exports = router;
