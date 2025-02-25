const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactions", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactions");
  const { title, num } = req.query;
  console.log(
    "title in /transactions:",
    title,
    "\n",
    "num in /transactions:",
    num
  );
  let filter = {};
  if (title) {
    filter.product_name = new RegExp(title, "i");
  }
  if (num) {
    const searchPrice = Number(num);
    console.log("searchPrice in /transactions:", searchPrice);
    filter.product_price = searchPrice;
  }
  if (title || num) {
    const transactions = await Transactions.find(filter);
    console.log("transactions in /transactions (GET):", transactions);
    return res.status(200).json(transactions);
  } else {
    const transactions = await Transactions.find();
    // console.log("transactions in /transactions (GET):", transactions);
    return res.status(200).json(transactions);
  }
});

module.exports = router;
