const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//models
const Offer = require("../../models/Offer");

router.put("/addFavOffer/:id", async (req, res) => {
  console.log("je suis sur la route addFavOffer/:id (PUT)");

  try {
    const id = req.params.id;
    const countAddFav = await Offer.findByIdAndUpdate(
      id,
      { $inc: { isFavorite: +1 } },
      {
        new: true,
      }
    );
    console.group("log in /addFavOffer:");
    console.log("id on addFavOffer/:id (PUT):", id);
    console.log("countAddFav on addFavOffer/:id (PUT):", countAddFav);
    console.groupEnd();
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
