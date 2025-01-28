const express = require("express");
const router = express.Router();
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const CryptoJS = require("crypto-js");
const { message } = require("statuses");
const jwt = require("jsonwebtoken");

//moment.js
const moment = require("moment/moment.js");
moment.locale("fr");

//models
const User = require("../../models/User");

//utils
// const passwordValidator = require("../../utils/passwordValidator");
const setLockAndCountLoginFailed = require("../../utils/setLockAndCountLoginFailed");
const createToken = require("../../utils/createToken");
const sendEmail = require("../../utils/sendEmail");
const generateCode = require("../../utils/generateCode");

router.post("/login", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /login");
  try {
    const { password, email } = req.body;
    // console.log(
    //   "password on /login:",
    //   password,
    //   "\n",
    //   "email on /login:",
    //   email
    // );
    // const passwordCheck = passwordValidator.validatePassword(password);
    // console.log("passwordCheck:", passwordCheck);
    // if (passwordCheck.isValid !== true) {
    //   return res.status(400).json({ message: passwordCheck.message });
    // }

    if (!password || !email) {
      return res.status(400).json({ message: "input is missing" });
    }

    const user = await User.findOne({ email: email });
    // console.log("user on /login:", user);
    if (!user) {
      return res.status(400).json({ message: "Bad request." });
    }

    // Vérification si l'utilisateur est verrouillé
    if (user.isLocked) {
      const unlock = moment().isAfter(user.lockUntil);
      console.log("unlock on /login:", unlock);

      if (unlock) {
        const username = user.account.username;
        const code = generateCode(6);
        console.log("code in /login:", code);
        user.code = code;
        sendEmail(user, username, email, code);
        user.isLocked = false;
        user.loginFailed = 0;
        await user.save();
        console.log("user.isLocked on /login:", user.isLocked);
        console.log("user.loginFailed on /login:", user.loginFailed);
      } else {
        return res
          .status(403)
          .json({ message: "Your account is currently locked." });
      }
    }

    const pwdHash = SHA256(password + user.salt).toString(encBase64);
    if (pwdHash !== user.hash) {
      setLockAndCountLoginFailed(user);
      await user.save();
      return res.status(400).json({ message: "Oops, something went wrong" });
    }

    // Gestion des droits administrateurs
    if (user.becomeAdmin) {
      user.isAdmin = true;
      user.becomeAdmin = false;
      await user.save();
    }

    const { accessToken, refreshToken } = await createToken(user);
    user.token = accessToken;
    await user.save();
    res.cookie("refreshTokenV", refreshToken, {
      httpOnly: false,
      secure: true, // mettre à true en prod
      sameSite: "Strict", // mettre à strict en prod
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2j
    });
    res.cookie("accessTokenV", accessToken, {
      httpOnly: false,
      secure: true, // mettre à true en prod
      sameSite: "Strict", // mettre à strict en prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7j
    });
    res.status(200).json("login succesfully");
    console.log(
      "accessToken in /login:",
      accessToken,
      "\n",
      "refreshToken in /login:",
      refreshToken
    );
    res.status(200).json("login succesfully");
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
