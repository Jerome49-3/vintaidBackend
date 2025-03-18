const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../../models/Offer.js");
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
// const isFileToUpload = require("../../../middleware/isFileToUpload.js");
const fileUpload = require("express-fileupload");
const savePictures = require("../../../utils/savePictures.js");

router.put("/offer/:id", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route PUT /offer/:id");
  const offerId = req.params.id;
  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  if (offerIdIsValid) {
    try {
      let updateObj = {};
      console.log("offerIdIsValid in /offer/:id (PUT):", offerIdIsValid);
      //faire une recherche par l'id de l'offre
      const offer = await Offer.findById(offerId);
      console.log("offer in /offer/:id (PUT):", offer);
      // console.log(
      //   "req.files.pictures in /offer/:id (PUT):",
      //   req.files.pictures
      // );
      const { productName, productPrice, productDescription, productDetails } =
        req.body;
      console.log(
        "productName in /offer/:id (PUT):",
        productName,
        "\n",
        "productPrice in /offer/:id (PUT):",
        productPrice,
        "\n",
        "productDescription in /offer/:id (PUT):",
        productDescription,
        "\n",
        "productDetails in /offer/:id (PUT):",
        productDetails
      );
      if (productName && productName !== "null") {
        updateObj.product_name = productName;
        console.log(
          "updateObj.product_name in /offer/:id (PUT):",
          updateObj.product_name
        );
      } else {
        updateObj.product_name = offer.product_name;
      }
      if (productPrice && productPrice !== "null") {
        updateObj.product_price = productPrice;
        console.log(
          "updateObj.product_price in /offer/:id (PUT):",
          updateObj.product_price
        );
      } else {
        updateObj.product_price = offer.product_price;
      }
      if (productDescription && productDescription !== "null") {
        updateObj.product_description = productDescription;
        console.log(
          "updateObj.product_description in /offer/:id (PUT):",
          updateObj.product_description
        );
      } else {
        updateObj.product_description = offer.product_description;
      }
      if (productDetails) {
        // console.log(
        //   "Array.isArray(productDetails) in /offer/:id (PUT):",
        //   Array.isArray(productDetails)
        // );
        // console.log(
        //   "typeof productDetails in /offer/:id (PUT):",
        //   typeof productDetails
        // );
        const objDetails = JSON.parse(productDetails);
        console.log("objDetails in /offer/:id (PUT):", objDetails);
        updateObj.product_details = objDetails;
        console.log(
          "updateObj.product_details in /offer/:id (PUT):",
          updateObj.product_details
        );
      }

      // if (req.files.pictures) {
      //   const picturesSaved = await savePictures(req, res);
      //   console.log("picturesSaved in /offer/:id (PUT):", picturesSaved);
      //   const reqPictures = req.uploadMultiFile;
      //   console.log("reqPictures in /offer/:id (PUT):", reqPictures);
      // }
      console.log(
        "updateObj before findByIdAndUpdate in /offer/:id (PUT):",
        updateObj
      );
      console.log(
        "offerId before findByIdAndUpdate in /offer/:id (PUT):",
        offerId
      );
      console.log(
        "typeof offerId before findByIdAndUpdate in /offer/:id (PUT):",
        typeof offerId
      );
      const offerUpdated = await Offer.findByIdAndUpdate(offerId, updateObj, {
        new: true,
      });
      console.log("offerUpdated after findByIdAndUpdate:", offerUpdated);
    } catch (error) {}
  }
});
module.exports = router;
