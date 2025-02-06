const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Offer = require("../../models/Offer");
const User = require("../../models/User");

router.get("/offers/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id");
  const offerId = req.params.id;
  console.log("offerId in /offers/:id", offerId);

  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  // console.log("offerIdIsValid in /offers/:id:", offerIdIsValid);
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offer = await Offer.findById(offerId);
      console.log("offerId after findbyid in /offers/:id:", offerId);
      console.log("offer in /offers/:id:", offer);
      if (offer) {
        const userId = offer.owner;
        // console.log("userId in /offers/:id:", userId);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind after findbyid in /offers/:id:", ownerFind);
        // const offerDetails = offer.product_details;
        // console.log("offerDetails:", offerDetails);
        return res.status(200).json({
          product_name: offer.product_name,
          product_description: offer.product_description,
          product_price: offer.product_price,
          product_details: offer.product_details,
          product_image: offer.product_image,
          product_pictures: offer.product_pictures,
          product_id: offer._id,
          owner: ownerFind,
        });
      }
    } catch (error) {
      console.log("error:", error, "\n", "error.message:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ message: "bad request" });
  }
});

module.exports = router;
