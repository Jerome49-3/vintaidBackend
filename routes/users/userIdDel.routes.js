const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");

router.delete("/userId/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route in /users/:id (DELETE):");
  const id = req.params.id;
  console.log("id in /users/:id (DELETE):", id);
  const userIdAdmin = req.user.isAdmin;
  console.log("userIdAdmin in /users/:id (DELETE):", userIdAdmin);
  if (id && userIdAdmin === true) {
    const findUserByID = await User.findById(id);
    // console.log("findUserByID in /users/:id (DELETE):", findUserByID);
    try {
      if (mongoose.Types.ObjectId.isValid(findUserByID)) {
        //I research all offers of this user
        const arrOffersId = await Offer.find({ owner: id });
        // console.log("arrOffersId in /users/:id (DELETE):", arrOffersId);
        //for each offers: i delete, in first: the picture of offer, second: then the offer.
        for (let i = 0; i < arrOffersId.length; i++) {
          const eachOffer = array[i];
          console.log("eachOffer in for on /users/:id (DELETE):", eachOffer);
          if (eachOffer.product_image) {
            console.log(
              "eachOffer.product_image in for on /users/:id (DELETE):",
              eachOffer.product_image
            );
            // cloudinary.uploader.destroy(eachOffer.product_image.public_id);
          }
        }
        // await User.findByIdAndDelete(id);
      } else {
        res.status(400).json({ message: "objectID not valid" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }
  res.status(200).json({ message: "user deleted" });
});

module.exports = router;
