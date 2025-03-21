const jwt = require("jsonwebtoken");

//model
const User = require("../models/User");

//utils
const createToken = require("../utils/createToken");

const isAuthenticated = async (req, res, next) => {
  // console.log(
  //   "req?.cookies?.refreshTokenV in isAuthenticated:",
  //   req?.cookies?.refreshTokenV
  // );
  // console.log(
  //   "req.headers.authorization in isAuthenticated:",
  //   req.headers.authorization
  // );
  const newAccessToken = await req?.headers?.authorization?.replace(
    "Bearer ",
    ""
  );
  // console.log("newAccessToken in isAuthenticated::", newAccessToken);
  const NewRefreshToken = await req?.cookies?.refreshTokenV;
  // console.log("NewRefreshToken in isAuthenticated::", NewRefreshToken);
  if (!newAccessToken && !NewRefreshToken) {
    return res.status(401).send("forbidden, no token allowed");
  }
  try {
    const decoded = jwt.verify(newAccessToken, process.env.JWT_SECRET);
    // console.log("decoded newAccessToken in isAuthenticated:", decoded);
    req.accessToken = newAccessToken;
    req.user = decoded;
    next();
  } catch (error) {
    if (!NewRefreshToken) {
      return res.status(401).send("forbidden, no token allowed");
    } else {
      try {
        const decoded = jwt.verify(NewRefreshToken, process.env.JWT_SECRET);
        // console.log("decoded NewRefreshToken in isAuthenticated:", decoded);
        const user = await User.findById(decoded._id);
        // console.log("user find with NewRefreshToken in isAuthenticated:", user);
        const { accessToken, refreshToken } = await createToken(user);
        if (process.env.NODE_ENV === "developpement") {
          res
            .cookie("refreshTokenV", refreshToken, {
              httpOnly: true,
              path: "/",
              domain: "localhost",
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
            })
            .header("Authorization", accessToken);
          req.user = user;
          // console.log(" req.user in isAuthenticated:", req.user);
          next();
        } else {
          res
            .cookie("refreshTokenV", refreshToken, {
              httpOnly: true,
              path: "/",
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7jr
            })
            .header("Authorization", accessToken);
          req.refreshToken = accessToken;
          // console.log(" req.token in isAuthenticated:", req.token);
          const user = await User.findById(decoded)
            .populate({
              path: "owner",
              select: "account",
            })
            .populate({
              path: "passwordIsChanged",
            })
            .select(
              "email newsletter isAdmin becomeAdmin emailIsConfirmed loginFailed lockDate isLocked lockUntil code date tokenIsValid"
            );
          req.user = user;
          // console.log(" req.user in isAuthenticated:", req.user);
          next();
        }
      } catch (error) {
        return res.status(400).send("forbidden: invalid token");
      }
    }
  }
};

module.exports = isAuthenticated;
