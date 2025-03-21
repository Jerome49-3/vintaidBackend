const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Offer = require("../../../models/Offer.js");
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
// const isFileToUpload = require("../../../middleware/isFileToUpload.js");
const fileUpload = require("express-fileupload");
const savePictures = require("../../../utils/savePictures.js");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../../../utils/convertToBase64.js");

router.put("/offer/:id", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route PUT /offer/:id");
  const offerId = req.params.id;
  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  console.log("req.body:", req.body);

  try {
    if (offerIdIsValid) {
      let updateObj = {};
      console.log("offerIdIsValid in /offer/:id (PUT):", offerIdIsValid);
      //faire une recherche par l'id de l'offre
      const offer = await Offer.findById(offerId);
      console.log("offer in /offer/:id (PUT):", offer);
      // console.log(
      //   "req.files.pictures in /offer/:id (PUT):",
      //   req.files.pictures
      // );
      const {
        productName,
        productPrice,
        productDescription,
        productDetails,
        offerSolded,
        infoImgSupp,
      } = req.body;
      // console.log(
      //   "productName in /offer/:id (PUT):",
      //   productName,
      //   "\n",
      //   "productPrice in /offer/:id (PUT):",
      //   productPrice,
      //   "\n",
      //   "productDescription in /offer/:id (PUT):",
      //   productDescription,
      //   "\n",
      //   "productDetails in /offer/:id (PUT):",
      //   productDetails,
      //   "\n",
      //   "offerSolded in /offer/:id (PUT):",
      //   offerSolded,
      //   "\n",
      //   "infoImgSupp in /offer/:id (PUT):",
      //   infoImgSupp
      // );
      try {
        if (productName && productName !== "null") {
          updateObj.product_name = productName;
          console.log(
            "updateObj.product_name in /offer/:id (PUT):",
            updateObj.product_name
          );
        } else {
          updateObj.product_name = offer.product_name;
        }
      } catch (error) {
        console.log("error in updateObj.product_name:", error);
      }
      try {
        if (productPrice && productPrice !== "null") {
          updateObj.product_price = productPrice;
          console.log(
            "updateObj.product_price in /offer/:id (PUT):",
            updateObj.product_price
          );
        } else {
          updateObj.product_price = offer.product_price;
        }
      } catch (error) {
        console.log("error in updateObj.product_price:", error);
      }
      try {
        if (offerSolded && offerSolded !== "null") {
          updateObj.offer_solded = Boolean(offerSolded);
          console.log(
            "updateObj.offer_solded in /offer/:id (PUT):",
            updateObj.offer_solded
          );
        } else {
          updateObj.offer_solded = offer.offer_solded;
        }
      } catch (error) {
        console.log("error in updateObj.offer_solded:", error);
      }
      try {
        if (productDescription && productDescription !== "null") {
          updateObj.product_description = productDescription;
          // console.log(
          //   "updateObj.product_description in /offer/:id (PUT):",
          //   updateObj.product_description
          // );
        } else {
          updateObj.product_description = offer.product_description;
        }
      } catch (error) {
        console.log("error in updateObj.product_description:", error);
      }
      try {
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
          // console.log("objDetails in /offer/:id (PUT):", objDetails);
          updateObj.product_details = objDetails;
          console.log(
            "updateObj.product_details in /offer/:id (PUT):",
            updateObj.product_details
          );
        } else {
          updateObj.product_details = offer.product_details;
        }
      } catch (error) {
        console.log("error in updateObj.product_details:", error);
      }
      try {
        if (req.files.pictures) {
          console.log(
            "req.files.pictures 2 in /offer/:id (PUT):",
            req.files.pictures
          );
          const picUpload = req.files.pictures;
          if (offer.product_pictures.length > 0) {
            let newOfferProductPictures = [...offer.product_pictures];
            console.log(
              "newOfferProductPictures in /offer/:id (PUT):",
              newOfferProductPictures
            );
            const definePicUpload = Array.isArray(picUpload);
            console.log(
              "definePicUpload in /offer/:id (PUT):",
              definePicUpload
            );
            if (definePicUpload !== false) {
              try {
                for (let i = 0; i < picUpload.length; i++) {
                  console.log(
                    "picUpload[i] after for on /offer/publish (POST):",
                    "\n",
                    picUpload[i]
                  );
                  if (picUpload[i].size < 10485760) {
                    console.log(
                      "picUpload[i].size after for on /offer/publish (POST):",
                      picUpload[i].size
                    );
                    //**** pour chaque image convertir en base64 et envoyer les envoyer les images à cloudinary ****//
                    const arrayOfPromises = await picUpload.map((picture) => {
                      console.log("picture on /offer/publish (POST):", picture);
                      return cloudinary.uploader.upload(
                        convertToBase64(picture),
                        {
                          folder: "vinted/offers/" + offer._id,
                        }
                      );
                    });
                    console.log(
                      "arrayOfPromises on /offer/publish (POST):",
                      arrayOfPromises
                    );
                    //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
                    const result = await Promise.all(arrayOfPromises);
                    console.log(
                      "resultPromise on /offer/publish (POST):",
                      result
                    );
                    //**** stocker les informations des images dans req ****//
                    req.uploadMultiFile = await result;
                    console.log(
                      "req.uploadMultiFile on /offer/publish (POST):",
                      req.uploadMultiFile
                    );
                    try {
                      const arrInfoImgSupp = JSON.parse(infoImgSupp);
                      console.log(
                        "arrInfoImgSupp 1 in /offer/:id (PUT):",
                        arrInfoImgSupp
                      );
                      for (let i = 0; i < arrInfoImgSupp.length; i++) {
                        const elementArrInfoImgSupp = arrInfoImgSupp[i];
                        console.log(
                          "elementArrInfoImgSupp:",
                          elementArrInfoImgSupp
                        );
                        const index = elementArrInfoImgSupp.indexImgSupp;
                        console.log("typeof index:", typeof index);
                        const publicId = elementArrInfoImgSupp.imgSuppPublicId;
                        console.log("publicId:", publicId);
                        const imgDeletedOnCloudinary =
                          await cloudinary.uploader.destroy(publicId);
                        console.log(
                          "imgDeletedOnCloudinary:",
                          imgDeletedOnCloudinary
                        );
                        newOfferProductPictures.splice(
                          index,
                          1,
                          req.uploadMultiFile[index]
                        );
                      }
                      req.newProductPictures = newOfferProductPictures;
                    } catch (error) {
                      console.log("error on for arrInfoImgSupp:", error);
                    }
                  } else {
                    res.status(400).json({
                      message:
                        " one/many image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                    });
                  }
                }
              } catch (error) {
                console.log("error on save multi image on cloudinary:", error);
              }
            } else {
              try {
                if (picUpload.size < 10485760) {
                  console.log(
                    "picUpload.size after if on /offer/publish (POST):",
                    picUpload.size
                  );
                  //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
                  const result = await cloudinary.uploader.upload(
                    convertToBase64(picUpload),
                    {
                      folder: "vinted/offers/" + offer._id,
                    }
                  );
                  console.log(
                    "resultnotPromise on /offer/publish (POST):",
                    result
                  );
                  //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
                  req.uploadOneFile = await result;
                  console.log(
                    "req.uploadOneFile on /offer/publish (POST):",
                    req.uploadOneFile
                  );
                } else {
                  res.status(400).json({
                    message:
                      "image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                  });
                }
              } catch (error) {
                console.log("error on save one image on cloudinary:", error);
              }
              try {
                const arrInfoImgSupp = JSON.parse(infoImgSupp);
                console.log(
                  "arrInfoImgSupp 1 in /offer/:id (PUT):",
                  arrInfoImgSupp
                );
                for (let i = 0; i < arrInfoImgSupp.length; i++) {
                  const elementArrInfoImgSupp = arrInfoImgSupp[i];
                  console.log("elementArrInfoImgSupp:", elementArrInfoImgSupp);
                  const index = elementArrInfoImgSupp.indexImgSupp;
                  console.log("typeof index:", typeof index);
                  const publicId = elementArrInfoImgSupp.imgSuppPublicId;
                  console.log("publicId:", publicId);
                  const imgDeletedOnCloudinary =
                    await cloudinary.uploader.destroy(publicId);
                  console.log(
                    "imgDeletedOnCloudinary:",
                    imgDeletedOnCloudinary
                  );
                  newOfferProductPictures.splice(index, 1, req.uploadOneFile);
                  req.newProductPictures = newOfferProductPictures;
                }
              } catch (error) {
                console.log("error on for arrInfoImgSupp:", error);
              }
            }
          } else {
            // let newObjProductImage = { ...offer.product_image };
          }
          try {
          } catch (error) {
            console.log("pictureError in /offer/:id (PUT):", error);
          }
          updateObj.product_pictures = req.newProductPictures;
        }
      } catch (error) {
        console.log("error in req.files.pictures:", error);
      }

      // console.log(
      //   "updateObj before findByIdAndUpdate in /offer/:id (PUT):",
      //   updateObj
      // );
      // console.log(
      //   "offerId before findByIdAndUpdate in /offer/:id (PUT):",
      //   offerId
      // );
      // console.log(
      //   "typeof offerId before findByIdAndUpdate in /offer/:id (PUT):",
      //   typeof offerId
      // );
      const offerUpdated = await Offer.findByIdAndUpdate(offerId, updateObj, {
        new: true,
      });
      // console.log("offerUpdated after findByIdAndUpdate:", offerUpdated);
      res.status(200).json({ infoUser: "offer updated" });
    } else {
      res.status(400).json({ message: "not offer founded" });
    }
  } catch (error) {
    res.status(500).json({ message: "oups: somethong went wrong" });
    console.log("error server:", error);
  }
});
module.exports = router;
