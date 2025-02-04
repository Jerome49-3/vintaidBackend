const User = require("../models/User");

const isRateLimited = (req, res, next) => {
  let nbrOfRequest = 0;
  try {
    // console.log("req in isRateLimited:", req);
    const ipUser =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    console.log(
      "req.headersx-forwarded-for in isRateLimited:",
      req.headers["x-forwarded-for"]
    );
    console.log(
      "req.connection.remoteAddress in isRateLimited:",
      req.connection.remoteAddress
    );
    console.log(
      "req.socket.remoteAddress in isRateLimited:",
      req.socket.remoteAddress
    );
    console.log("ipUser in isRateLimited:", ipUser);
    if (ipUser) {
      const firstRequestUser = Date.now();
      nbrOfRequest++;
      if (firstRequestUser) {
        const firstRequestUserAddingOneMinute = Date.now() + 60000;
        if (firstRequestUserAddingOneMinute > firstRequestUser) {
          return res.status(429).json("Too Many Requests");
        } else {
          next();
        }
      }
    }
  } catch (error) {
    console.error("Error in isRateLimited:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isRateLimited;
