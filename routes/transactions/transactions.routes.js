const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactions", isAuthenticated, async (req, res) => {
  // console.log("req.headers in transactions:", req.headers);
  console.log("je suis sur la route /transactions");
  const { title, numberCommand } = req.query;
  // console.log(
  //   "title in /transactions:",
  //   title,
  //   "\n",
  //   "numberCommand in /transactions:",
  //   numberCommand
  // );
  let filter = {};
  if (title) {
    filter.product_name = new RegExp(title, "i");
  }
  if (numberCommand) {
    console.log("numberCommand in /transactions:", numberCommand);
    filter.number_command = new RegExp(numberCommand, "i");
  }
  if (title || numberCommand) {
    const transactions = await Transactions.find(filter).populate([
      {
        path: "offer",
        match: { product_name: title },
      },
      {
        path: "seller",
        select: "account email",
        match: { "account.username": title },
      },
      {
        path: "buyer",
        select: "account email",
        match: { "account.username": title },
      },
    ]);
    console.log("transactions in /transactions (GET):", transactions);
    return res.status(200).json(transactions);
  } else {
    const transactions = await Transactions.find().populate([
      {
        path: "buyer",
        select: "account.username account.avatar.secure_url",
      },
      {
        path: "offer",
        populate: {
          path: "owner",
          select: "account.username account.avatar.secure_url email date",
        },
      },
    ]);
    console.log("transactions in /transactions (GET):", transactions);
    return res.status(200).json(transactions);
  }
});

module.exports = router;
