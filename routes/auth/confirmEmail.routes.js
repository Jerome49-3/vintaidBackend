const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

//models
const User = require("../../models/User");

//utils
const createToken = require("../../utils/createToken");

router.post("/confirmemail", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /confirmemail");
  const { code, emailSended, userCreated } = req.body;
  console.log(
    "code in /confirmemail:",
    code,
    "\n",
    "emailSended in /confirmemail:",
    emailSended,
    "\n",
    "userCreated in /confirmEmail:",
    userCreated
  );
  const codeInput = JSON.parse(code).join("");
  if (codeInput) {
    console.log("codeInput in /confirmemail:", codeInput);
    const user = await User.findOne({ code: codeInput }).select(
      "-hash -salt -becomeAdmin"
    );
    console.log("user in /confirmemail:", user);
    if (!user) {
      res.status(400).json({
        message: "Oups, somethings went wrong: please, check your code",
      });
    }
    if (user) {
      // console.log("user in /confirmemail:", user);
      const { accessToken, refreshToken } = await createToken(user);
      // console.log(
      //   "accessToken in /confirmemail:",
      //   accessToken,
      //   "\n",
      //   "refreshToken in /confirmemail:",
      //   refreshToken
      // );
      user.token = refreshToken;
      user.emailIsConfirmed = true;
      if (user.emailIsConfirmed !== false) {
        await User.updateOne({ code: codeInput }, { $unset: { expireAt: "" } });
      }
      await user.save();
      //DEVELLOPPEMENT
      if (emailSended === "false") {
        console.log("emailSended === false");
        console.log("typeof emailSended", typeof emailSended);
        if (process.env.NODE_ENV === "developpement") {
          console.log("process.env.NODE_ENV in /login:", process.env.NODE_ENV);
          return res
            .cookie("refreshTokenV", refreshToken, {
              httpOnly: true,
              path: "/",
              domain: "localhost",
              secure: false,
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
            })
            .header("Authorization", accessToken)
            .status(200)
            .json({
              token: accessToken,
              message:
                "Merci votre email est bien confirmé, vous aller être redirigé vers la route /publish",
            });
        } else {
          return res
            .cookie("refreshTokenV", refreshToken, {
              httpOnly: true,
              path: "/",
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
            })
            .header("Authorization", accessToken)
            .status(200)
            .json({
              token: accessToken,
              message: "Merci: votre email est bien confirmé",
            });
        }
      } else {
        console.log("emailSended === true");
        const { stateToken } = await createToken(user);
        console.log("stateToken in /confirmemail:", stateToken);
        user.stateTk = stateToken;
        user.emailIsConfirmed = true;
        if (user.emailIsConfirmed !== false) {
          await User.updateOne(
            { code: codeInput },
            { $unset: { expireAt: "" } }
          );
        }
        user.stateTk = stateToken;
        await user.save();
        return res.status(200).json({
          stateTk: stateToken,
          success: "/forgotPassword",
          message: "Merci: votre email est bien confirmé",
        });
      }
    }
  } else {
    return res.status(400).json({ message: "Oups, somthing went wrong" });
  }
});

module.exports = router;
