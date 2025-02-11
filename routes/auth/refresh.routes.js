const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//utils
const createToken = require("../../utils/createToken");

//middleware
const isAuthenticated = require("../../middleware/isAuthenticated");

//models
const User = require("../../models/User");

router.get("/refreshToken", async (req, res) => {
  // console.log("req.cookies:", req.cookies);

  const newRefreshToken = await req?.cookies?.refreshTokenV;
  // console.log("newRefreshToken in /refreshToken:", newRefreshToken);
  if (!newRefreshToken) {
    return res.status(401).send("forbidden: no token");
  } else {
    try {
      const decoded = jwt.verify(newRefreshToken, process.env.JWT_SECRET);
      // console.log("decodedNewRefreshToken in /refreshToken:", decoded);

      if (decoded) {
        // console.log("decoded after if on /refreshToken:", decoded);
        const user = await User.findById(decoded._id);
        // console.log("user on /refreshToken:", user);
        const { accessToken, refreshToken } = await createToken(user);
        // console.log("accessToken on /refreshToken:", accessToken);
        // console.log("refreshToken on /refreshToken:", refreshToken);
        if (process.env.NODE_ENV === "developpement") {
          // console.log(
          //   "process.env.NODE_ENV on /refreshToken:",
          //   process.env.NODE_ENV
          // );
          return res
            .cookie("refreshTokenV", refreshToken, {
              httpOnly: true,
              path: "/",
              domain: "localhost",
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
            })
            .header("Authorization", accessToken)
            .json({ token: accessToken });
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
            .json({ token: accessToken });
        }
      }
    } catch (error) {
      return res.status(400).send("token invalide");
    }
  }
});

module.exports = router;
