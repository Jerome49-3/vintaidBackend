const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//middleware
const isAuthenticated = require("../../../middleware/isAuthenticated");

//models
const Offer = require("../../../models/Offer");
const User = require("../../../models/User");

router.delete("/offer/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route delete /offer/:id (DELETE):");
  console.log("req.user in /offer/:id (DELETE)", req.user);
  userId = req.user._id;
  console.log("userId in /offer/:id (DELETE)", userId);
  const offerId = req.params.id;
  console.log("offerId in /offer/:id (DELETE)", offerId);
  try {
    if (mongoose.Types.ObjectId.isValid(offerId)) {
      const offerDelete = await Offer.findByIdAndDelete(offerId);
      console.log("offerDelete in /offer/:id (DELETE)", offerDelete);
      const allOffersUser = await Offer.find({ owner: userId });
      console.log("allOffersUser in /offer/:id (DELETE)", allOffersUser);
      res
        .status(201)
        .json({ offers: allOffersUser, infoUser: "L'offre à été supprimé" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  res.status(200).json({ message: "l'offre à été supprimé" });
});

module.exports = router;
