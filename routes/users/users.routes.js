const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");

//models
const User = require("../../models/User.js");

router.get("/users", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /users ");
  // console.log("req.user:", req.user);
  const date = moment().format("l");
  // console.log("date in /users:", date);
  try {
    const users = await User.find();
    // console.log("users in /users:", users);
    let lastUsers = [];
    for (let i = 0; i < users.length; i++) {
      const el = users[i];
      // console.log("el:", el);
      lastUsers.push({
        account: el.account,
        email: el.email,
        newsletter: el.newsletter,
        date: el.date,
        isAdmin: el.isAdmin,
        id: el._id,
        token: el.token,
        isLocked: el.isLocked,
        lockDate: el.lockDate,
        lockUntil: el.lockUntil,
        loginFailed: el.loginFailed,
        emailIsConfirmed: el.emailIsConfirmed,
        becomeAdmin: el.becomeAdmin,
        createdAt: el.createdAt,
        expiresAt: el.expiresAt,
      });
    }
    res.status(200).json(lastUsers);
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(400).json({ message: "somethings went wrong" });
  }
});

module.exports = router;
