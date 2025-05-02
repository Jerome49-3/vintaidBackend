const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//models
const Offer = require("../../models/Offer");

router.put("/suppFavOffer/:id", async (req, res) => {
  console.log("je suis sur la route suppFavOffer/:id (PUT)");

  try {
    const id = req.params.id;
    const countSuppFav = await Offer.findByIdAndUpdate(
      id,
      { $inc: { isFavorite: -1 } },
      {
        new: true,
      }
    );
    console.group("log in suppFavOffer/:id (PUT):");
    console.log("id on suppFavOffer/:id (PUT):", id);
    console.log("countSuppFav on suppFavOffer/:id (PUT):", countSuppFav);
    console.groupEnd();
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
