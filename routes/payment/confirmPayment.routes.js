const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");

//models
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const Transactions = require("../../models/Transactions.js");
// const ShoppingCart = require("../../models/ShoppingCart.js");

router.post(
  "/confirmPayment",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("je suis sur la route on /confirmPayment:");
    const {
      offer_solded,
      product_id,
      product_price,
      buyer_address,
      numberOfCommand,
      product_title,
    } = req.body;
    console.log(
      "product_title on /confirmPayment:",
      product_title,
      "\n",
      "offer_solded on /confirmPayment:",
      offer_solded,
      "\n",
      "product_id on /confirmPayment:",
      product_id,
      "\n",
      "product_price on /confirmPayment:",
      product_price,
      "\n",
      "buyer_address on /confirmPayment:",
      buyer_address,
      "\n",
      "numberOfCommand on /confirmPayment:",
      numberOfCommand
    );
    const userId = req.user._id;
    console.log("userId in /confirmPayment:", userId);
    const offer = await Offer.findById(product_id).populate({
      path: "owner",
      select: "account email",
    });
    console.log("offer in /confirmPayment:", offer);
    if (req.body.offer_solded) {
      try {
        const offerSolded = await Offer.findByIdAndUpdate(product_id, {
          offer_solded: true,
        });
        console.log("offerSolded on /confirmPayment:", offerSolded);
        const date = moment().locale("fr").format("L");
        console.log("date on /confirmPayment:", date);
        // console.log("typeof date on /confirmPayment:", typeof date);
        const vendeur = await User.findById(offer.owner).select(
          "account email"
        );
        console.log("vendeur in on /confirmPayment:", vendeur);
        const acheteur = await User.findById(req.user._id).select(
          "account email"
        );
        console.log("acheteur on /confirmPayment:", acheteur);
        const buyerAdress = JSON.parse(buyer_address);
        console.log("buyerAdress on /confirmPayment:", buyerAdress);
        const newTransactions = new Transactions({
          product_name: product_title,
          product_price: product_price,
          seller: offer.owner,
          buyer: userId,
          buyer_address: buyerAdress,
          offer: offer._id,
          date: date,
          number_command: numberOfCommand,
        });
        console.log("newTransactions on /confirmPayment:", newTransactions);
        await newTransactions.save();
        return res.status(201).json({ message: "Offer marked as sold." });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
