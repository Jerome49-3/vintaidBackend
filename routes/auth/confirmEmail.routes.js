const express = require("express");
const router = express.Router();
const Mailgun = require("mailgun.js");
const fileUpload = require("express-fileupload");

//models
const User = require("../../models/User");

//utils
const createToken = require("../../utils/createToken");

router.post("/confirmemail", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /confirmemail");
  const { code } = req.body;
  const codeInput = JSON.parse(code).join("");
  if (codeInput) {
    const user = await User.findOne({ code: codeInput });
    console.log("codeInput in /confirmemail:", codeInput);
    if (user) {
      console.log("user in /confirmemail:", user);
      const { accessToken, refreshToken } = await createToken(user);
      console.log(
        "accessToken in /confirmemail:",
        accessToken,
        "\n",
        "refreshToken in /confirmemail:",
        refreshToken
      );
      user.token = accessToken;
      user.emailIsConfirmed = true;
      await user.save();
      //PRODUCTION
      // res.cookie("refreshTokenV", refreshToken, {
      //   httpOnly: false,
      //   secure: true, // mettre à true en prod
      //   sameSite: "lax", // mettre à strict en prod
      //   maxAge: 2 * 24 * 60 * 60 * 1000, // 2j
      // });
      // res.cookie("accessTokenV", accessToken, {
      //   httpOnly: false,
      //   secure: true, // mettre à true en prod
      //   sameSite: "lax", // mettre à strict en prod
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7j
      // });
      //DEVELLOPPEMENT
      res.cookie("refreshTokenV", refreshToken, {
        httpOnly: false,
        secure: true, // mettre à true en prod
        sameSite: "none", // mettre à strict en prod
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2j
      });
      res.cookie("accessTokenV", accessToken, {
        httpOnly: false,
        secure: true, // mettre à true en prod
        sameSite: "none", // mettre à strict en prod
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7j
      });
      res.status(200).json({
        message:
          "Merci votre email est bien confirmé, vous aller être redirigé vers la route /publish",
      });
    }
  } else {
    return res.status(400).json({ message: "Oups, somthing went wrong" });
  }
});

module.exports = router;
