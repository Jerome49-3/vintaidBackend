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
    } = req.body;
    // console.log(
    //   "offer_solded on /confirmPayment:",
    //   offer_solded,
    //   "\n",
    //   "product_id on /confirmPayment:",
    //   product_id,
    //   "\n",
    //   "product_price on /confirmPayment:",
    //   product_price,
    //   "\n",
    //   "buyer_address on /confirmPayment:",
    //   buyer_address,
    //   "\n",
    //   "numberOfCommand on /confirmPayment:",
    //   numberOfCommand
    // );
    const offers = await Offer.findById(product_id);
    // console.log("offers in /payment:", offers);
    if (req.body.offer_solded) {
      try {
        const offerSolded = await Offer.findByIdAndUpdate(product_id, {
          offer_solded: true,
        });
        // console.log("offerSolded on /confirmPayment:", offerSolded);
        const date = moment().locale("fr").format("L");
        // console.log("date on /confirmPayment:", date);
        // console.log("typeof date on /confirmPayment:", typeof date);
        const vendeur = await User.findById(offers.owner);
        // console.log("vendeur in on /confirmPayment:", vendeur);
        const acheteur = await User.findById(req.user._id);
        // console.log("acheteur on /confirmPayment:", acheteur);
        const buyerAdress = JSON.parse(buyer_address);
        // console.log("buyerAdress on /confirmPayment:", buyerAdress);
        const newTransactions = new Transactions({
          product_name: offers.product_name,
          product_price: product_price,
          seller: {
            email: vendeur.email,
            account: vendeur.account,
            _id: vendeur._id,
          },
          buyer: {
            email: acheteur.email,
            account: acheteur.account,
          },
          buyerId: acheteur._id,
          buyer_address: buyerAdress,
          product_id: offers._id,
          date: date,
          number_command: numberOfCommand,
        });
        // console.log("newTransactions on /confirmPayment:", newTransactions);
        await newTransactions.save();
        return res.status(201).json({ message: "Offer marked as sold." });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
