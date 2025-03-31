const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const { SHA256 } = require("crypto-js");
const fileUpload = require("express-fileupload");
const checkToken = require("../../utils/checkToken");
const createToken = require("../../utils/createToken");

//models
const User = require("../../models/User");

router.post("/forgotPsswd", fileUpload(), async (req, res) => {
  console.log("je suis sur la route forgotPsswd (POST)");

  try {
    const { password, confirmPassword, tokenFgtP } = req.body;
    console.log(
      "password in /forgotPsswd:",
      password,
      "\n",
      "confirmPassword in /forgotPsswd:",
      confirmPassword,
      "\n",
      "tokenFgtP in /forgotPsswd:",
      tokenFgtP
    );
    // console.log("req?.headers?.authorization:", req?.headers?.authorization);
    //i assigne the token constant  with req.headers.authorization
    // const token = req?.headers?.authorization?.replace("Bearer ", "");
    // console.log("token in /forgotPsswd:", token);
    // i ckeck if token is valid with the function checkToken
    if (!tokenFgtP) {
      res.status(400).json({ message: "no token allowed" });
    } else {
      const tokenValid = await checkToken(tokenFgtP);
      console.log("tokenValid in /forgotPsswd:", tokenValid);
      const userId = tokenValid._id;
      console.log("userId in /forgotPsswd:", userId);
      if (password === confirmPassword) {
        const salt = uid2(16);
        const hashPassword = SHA256(password + salt).toString(encBase64);
        console.log("hashPassword in /forgotPsswd:", hashPassword);
        const hashConfirmPassword = SHA256(confirmPassword + salt).toString(
          encBase64
        );
        console.log(
          "hashConfirmPassword in /forgotPsswd:",
          hashConfirmPassword
        );
        if (hashPassword !== hashConfirmPassword) {
          return res
            .status(400)
            .json({ message: "Both passwords do not match" });
        } else {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
              hash: hashPassword,
              salt: salt,
              passwordIsChanged: {
                passwordChangedAt: new Date(Date.now()),
                passwordChanged: Boolean("true"),
              },
              stateTk: "",
            },
            { new: true }
          );
          console.log("updatedUser in /forgotPsswd:", updatedUser);
          const { accessToken, refreshToken } = await createToken(updatedUser);
          console.log(
            "accessToken in /forgotPsswd:",
            accessToken,
            "refreshToken in /forgotPsswd:",
            refreshToken
          );
          if (process.env.NODE_ENV === "developpement") {
            // console.log("process.env.NODE_ENV in /login:", process.env.NODE_ENV);
            res
              .cookie("refreshTokenV", refreshToken, {
                httpOnly: true,
                path: "/",
                domain: "localhost",
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
              })
              .header("Authorization", accessToken)
              .json({ token: accessToken, success: "password updated" });
          } else {
            res
              .cookie("refreshTokenV", refreshToken, {
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
              })
              .header("Authorization", accessToken)
              .json({ token: accessToken, success: "password updated" });
          }
        }
      }
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
