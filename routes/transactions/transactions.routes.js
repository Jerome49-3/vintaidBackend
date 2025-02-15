const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactions", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactions");
  const transactions = await Transactions.find();
  // console.log("transactions in /transactions (GET):", transactions);
  return res.status(200).json(transactions);
});

module.exports = router;
