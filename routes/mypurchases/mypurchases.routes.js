const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User");
const Transactions = require("../../models/Transactions.js");

router.get("/mypurchases", isAuthenticated, async (req, res) => {
  let myTransactions = [];
  console.log("je suis sur la route /mypurchases");
  const user = req.user;
  console.log("user on /mypurchases:", user);
  const userId = user._id;
  console.log("userId on /mypurchases:", userId);
  const userIdValid = mongoose.Types.ObjectId.isValid(userId);
  console.log("userIdValid on /mypurchases:", userIdValid);
  if (userIdValid) {
    try {
      //i research all transactions of the current user;
      const transactionsfinded = await Transactions.find({
        buyer: userId,
      }).populate([
        {
          path: "buyer",
          select: "account.username account.avatar.secure_url",
        },
        {
          path: "offer",
          populate: {
            path: "owner",
            select: "account.username account.avatar.secure_url",
          },
        },
      ]);
      // // for all offer who as offerSolded is true, i put them on a Array
      console.log("transactionsfinded on /mypurchases:", transactionsfinded);
      return res.status(200).json(transactionsfinded);
    } catch (error) {
      console.log("error on /mypurchases:", error);
    }
  } else {
  }
});

module.exports = router;
