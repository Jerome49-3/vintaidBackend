const express = require("express");
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");
const router = express.Router();
const fileUpload = require("express-fileupload");

//models
const User = require("../../models/User");
const errorCheckToken = require("../../utils/errorCheckToken");

router.post("/resendEmailPsswd", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /resetPsswdConfirmEmail (POST)");

  try {
    const { email } = req.body;
    console.log("email in /resendEmailPsswd:", email);
    if (!email) {
      return res.status(400).json({ message: "a field is missing" });
    }
    if (email) {
      const user = await User.findOne({ email: email }).select(
        "-hash -salt -becomeAdmin"
      );
      console.log("user in /resetPsswdConfirmEmail:", user);
      user.emailIsConfirmed = false;
      await user.save();
      if (!user) {
        return res.status(400).json({ message: "oops: somethings went wrong" });
      }

      if (user) {
        const emailSended = await sendEmail(user);
        await user.save();
        console.log("emailSended in /resetPsswdConfirmEmail:", emailSended);
        console.log(
          "emailSended.error in /resetPsswdConfirmEmail:",
          emailSended.error
        );
        if (emailSended.error === null) {
          // res.redirect(301, "http://localhost:5173/confirmemail");
          res
            .status(200)
            .json({ token: user?.stateTk, success: "/confirmemail" });
        }
      }
    }
  } catch (error) {
    console.log("error in catch in /resetPsswdConfirmEmail:", error);
    const errorResetPsswd = errorCheckToken(error);
    console.log(
      "errorResetPsswd in catch in /resetPsswdConfirmEmail:",
      errorResetPsswd
    );
  }
});

module.exports = router;
