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

router.post(
  "/messages/:OfferID",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("Je suis sur la route POST /messages/:OfferID");
    // console.log("req.body on POST /messages/:OfferID:", req.body);

    const offerID = new mongoose.Types.ObjectId(req.params.OfferID);
    // console.log("offerID on POST /messages/:OfferID:", offerID);

    let newMessagesArr = await MessagesChat.find({ offerId: offerID });
    // console.log("newMessagesArr in /messages/:OfferID:", newMessagesArr);
    const offer = await Offer.findOne(offerID).populate({
      path: "owner",
      populate: {
        path: "account",
      },
    });
    // console.log("offer:", offer);
    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable" });
    }
    const findSellerEmail = await offer.owner.email;
    // console.log("findSellerEmail in /messages/:OfferID:", findSellerEmail);
    const { newMessage } = req.body;
    // console.log("newMessage in /messages/:OfferID:", newMessage);
    if (!newMessage) {
      return res
        .status(400)
        .json({ error: "Le contenu du message est requis" });
    }
    const buyerID = req.user._id;
    const buyer = await User.findOne({ _id: buyerID }).populate("account");
    // console.log("buyer in /messages/:OfferID:", buyer);
    const date = await moment().locale("fr").format("L LT");
    // console.log("date in /messages/:OfferID:", date);
    // console.log("typeof date in /messages/:OfferID:", typeof date);
    const newMessages = new MessagesChat({
      text: newMessage,
      date: date,
      offerId: offerID,
      buyerObj: {
        account: buyer.account,
      },
    });
    // console.log("newMessages:", newMessages);
    newMessagesArr = [...newMessagesArr, newMessages];
    // console.log("newMessagesArr:", newMessagesArr);
    const savedMessage = await newMessages.save();
    // console.log("savedMessage:", savedMessage);
    if (!savedMessage) {
      return res
        .status(500)
        .json({ error: "Échec de l'enregistrement du message" });
    } else if (savedMessage) {
      const emailSend = await resend.emails.send({
        from: process.env.EMAIL_TO_ME,
        to: `${findSellerEmail}`,
        subject: "you are a new message",
        html: `<strong>${newMessage}</strong>
        <br/>
        <a>https://vintaid.netlify.app/</a>
        <br/>
      <p>The Vintaid admin team</p>`,
      });
    }
    // console.log("savedMessage in /messages/:OfferID:", savedMessage);
    res.status(200).json(newMessagesArr);
  }
);
module.exports = router;
