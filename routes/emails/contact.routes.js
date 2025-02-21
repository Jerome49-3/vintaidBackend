const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();

router.post("/contact", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /contact (POST)");
  console.log("req.user (expediteur):", expediteur);

  try {
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
