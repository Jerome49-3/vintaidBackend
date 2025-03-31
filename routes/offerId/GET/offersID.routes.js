const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Offer = require("../../../models/Offer");
const User = require("../../../models/User");

router.get("/offer/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id (GET):");
  const offerId = req.params.id;
  // console.log("offerId in /offers/:id", offerId);

  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  // console.log("offerIdIsValid in /offers/:id:", offerIdIsValid);
  if (offerId && offerIdIsValid) {
    try {
      const offer = await Offer.findById(offerId).populate({
        path: "owner",
        select: "account",
      });
      console.log("offer in /offers/:id:", offer);
      if (offer) {
        res.status(200).json({
          product_name: offer.product_name,
          product_description: offer.product_description,
          product_price: offer.product_price,
          product_details: offer.product_details,
          offer_solded: offer.offer_solded,
          product_image: offer.product_image,
          product_pictures: offer.product_pictures,
          product_id: offer._id,
          owner: offer.owner,
        });
      } else {
        return res.status(400).json({ infoUser: "no offer with this id" });
      }
    } catch (error) {
      console.log("error:", error, "\n", "error.message:", error.message);
      return res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ message: "bad request" });
  }
});

module.exports = router;
