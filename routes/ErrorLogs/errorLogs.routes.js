const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

import ErrorLogs from "../../models/ErrorLogs";

router.post("/errorLogs", async (req, res) => {
  console.log("je suis sur la route errorLogs (POST)");
  const { message, stack, componentStack, date } = req.body;
  try {
    const newError = new ErrorLogs({
      message: message,
      stack: stack,
      componentStack: componentStack,
      createdAt: date,
      expiresAt: Date.now() + 3600 * 1000 * 24 * 7,
    });
    console.log("newError on ErrorLogs", newError);
    await newError.save();
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
