const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");
const fileUpload = require("express-fileupload");
const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User.js");
const Messages = require("../../models/Messages.js");

router.get("/messages/:OfferID", isAuthenticated, async (req, res) => {
  console.log("Je suis sur la route GET /messages/:OfferID");
});

module.exports = router;
