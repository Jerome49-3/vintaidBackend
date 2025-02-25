const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactionId/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactionId/:id");
  const transId = req.params.id;
  console.log("transId in /transactions/:id (GET):", transId);
  const transactions = await Transactions.findById({ _id: transId });
  console.log("transactions in /transactions/:id (GET):", transactions);
  return res.status(200).json(transactions);
});

module.exports = router;
