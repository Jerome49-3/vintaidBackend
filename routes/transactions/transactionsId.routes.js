const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactionId/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactionId/:id");
  const transId = req.params.id;
  console.log("transId in /transactions/:id (GET):", transId);
  const transactionId = await Transactions.findById({ _id: transId }).populate([
    {
      path: "buyer",
      select: "account.username account.avatar.secure_url email date",
    },
    {
      path: "offer",
      populate: {
        path: "owner",
        select: "account.username account.avatar.secure_url email date",
      },
    },
  ]);
  console.log("transactionId in /transactions/:id (GET):", transactionId);
  return res.status(200).json(transactionId);
});

module.exports = router;
