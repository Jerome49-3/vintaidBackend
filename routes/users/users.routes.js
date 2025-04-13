const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");

//models
const User = require("../../models/User.js");

router.get("/users", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /users ");
  console.log("req.query in /users:", req.query);
  let { title } = req.query;
  console.log("title in /users:", title);
  // console.log("req.user:", req.user);
  const date = moment().format("l");
  // console.log("date in /users:", date);
  if (title) {
    try {
      let filter = {};
      filter.$or = [
        { "account.username": new RegExp(title, "i") },
        { email: new RegExp(title, "i") },
      ];
      const lastUsers = await User.find(filter).select("-hash -salt");
      console.log("lastUsers in /users:", lastUsers);
      res.status(200).json(lastUsers);
    } catch (error) {
      console.log("error in catch:", error);
      return res.status(400).json({ message: "somethings went wrong" });
    }
  } else {
    try {
      const lastUsers = await User.find().select("-hash -salt");
      console.log("lastUsers in /users:", lastUsers);
      res.status(200).json(lastUsers);
    } catch (error) {
      console.log("error in catch:", error);
      return res.status(400).json({ message: "somethings went wrong" });
    }
  }
});

module.exports = router;
