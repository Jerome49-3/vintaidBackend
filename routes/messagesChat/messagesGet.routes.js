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
const MessagesChat = require("../../models/MessagesChat.js");

router.get("/messages/:OfferID", isAuthenticated, async (req, res) => {
  console.log("Je suis sur la route GET /messages/:OfferID");
  const OfferID = req.params.OfferID;
  // console.log("OfferID in /messages/:OfferID:", OfferID);
  // console.log(
  //   "mongoose.Types.ObjectId.isValid(id):",
  //   mongoose.Types.ObjectId.isValid(OfferID)
  // );
  const messagesGet = await MessagesChat.find({ offerId: OfferID });
  // console.log("messagesGet in /messages/:OfferID:", messagesGet);
  return res.status(200).json(messagesGet);
});

module.exports = router;
