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

router.post(
  "/messages/:OfferID",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("Je suis sur la route POST /messages/:OfferID");
    let newMessagesArr = [];
    const offerId = req.params.OfferID;
    // console.log("offerId in /messages/:OfferID:", offerId);
    const offer = await Offer.findById(offerId);
    // console.log("offer:", offer);
    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable" });
    }
    const findSeller = await User.findById(offer.owner).select("email");
    // console.log("findSeller.email in /messages/:OfferID:", findSeller.email);
    if (!findSeller) {
      return res.status(404).json({ error: "Vendeur introuvable" });
    }
    const { newMessage } = req.body;
    // console.log("newMessage in /messages/:OfferID:", newMessage);
    if (!newMessage) {
      return res
        .status(400)
        .json({ error: "Le contenu du message est requis" });
    }
    const buyer = req.user;
    // console.log("buyer in /messages/:OfferID:", buyer);
    const date = moment().locale("fr").format("L");
    // console.log("date in /messages/:OfferID:", date);
    // console.log("typeof date in /messages/:OfferID:", typeof date);
    const newMessages = new Messages({
      text: newMessage,
      date: date,
      owner: buyer,
      offer: offer,
    });
    // console.log("newMessages:", newMessages);
    newMessagesArr = [...newMessagesArr, newMessages];
    console.log("newMessagesArr:", newMessagesArr);
    const savedMessage = await newMessages.save();
    console.log("savedMessage:", savedMessage);
    if (!savedMessage) {
      return res
        .status(500)
        .json({ error: "Échec de l'enregistrement du message" });
    } else if (savedMessage) {
      const emailSend = await resend.emails.send({
        from: process.env.EMAIL_TO_ME,
        to: `${findSeller.email}`,
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
