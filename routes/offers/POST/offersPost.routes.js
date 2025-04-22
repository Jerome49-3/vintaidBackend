const express = require("express");
const router = express.Router();
const Offer = require("../../../models/Offer.js");
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../../../utils/convertToBase64.js");

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("je suis sur  la route in /offer/publish");
    console.log("req.user in /offer/publish:", req.user);

    // console.log("req:", req);
    try {
      const {
        title,
        description,
        price,
        quantity,
        condition,
        city,
        brand,
        size,
        color,
      } = req.body;
      // console.log(
      //   "title in /offer/publish:",
      //   title,
      //   "\n",
      //   "description in /offer/publish:",
      //   description,
      //   "\n",
      // "price in /offer/publish:",
      // price,
      // "\n",
      // "quantity in /offer/publish:",
      // quantity,
      // "\n",
      //   "condition in /offer/publish:",
      //   condition,
      //   "\n",
      //   "city in /offer/publish:",
      //   city,
      //   "\n",
      //   "brand in /offer/publish:",
      //   brand,
      //   "\n",
      //   "size in /offer/publish:",
      //   size,
      //   "\n",
      //   "color in /offer/publish:",
      //   color
      // );
      // console.log("req.body:", req.body);
      // console.log("req.files:", req.files);
      //**** je stocke req.files.pictures dans une constante ****//
      const picUpload = req.files.pictures;
      // console.log("picUpload on /offer/publish (POST):", picUpload);
      const arrayPictures = Array.isArray(picUpload);
      console.log("arrayPictures on /offer/publish (POST):", arrayPictures);
      if (req.body !== undefined) {
        // console.log(
        //   "req.user.id in /offer/publish:",
        //   req.user._id,
        //   "req.user.account.username in /offer/publish:",
        //   req.user.account.username
        // );
        const newOffer = new Offer({
          product_name: title,
          product_description: description,
          product_price: price,
          product_quantity: quantity,
          product_details: [
            { MARQUE: brand },
            { TAILLE: size },
            { ÉTAT: condition },
            { COULEUR: color },
            { EMPLACEMENT: city },
          ],
          owner: req.user,
        });
        // console.log("newOffer before Save:", newOffer);
        try {
          //**** verifier la précense de req.files.pîctures ****//
          // console.log("req.files before if /offer/publish:", "\n", req.files);
          if (picUpload) {
            if (arrayPictures !== false) {
              for (let i = 0; i < picUpload.length; i++) {
                // console.log(
                //   "picUpload[i] after for on /offer/publish (POST):",
                //   "\n",
                //   picUpload[i]
                // );
                if (picUpload[i].size < 10485760) {
                  // console.log(
                  //   "picUpload[i].size after for on /offer/publish (POST):",
                  //   picUpload[i].size
                  // );
                  //**** pour chaque image convertir en base64 et envoyer les envoyer les images à cloudinary ****//
                  const arrayOfPromises = await picUpload.map((picture) => {
                    // console.log("picture on /offer/publish (POST):", picture);
                    return cloudinary.uploader.upload(
                      convertToBase64(picture),
                      {
                        folder: "vintaid/offer/" + newOffer._id,
                      }
                    );
                  });
                  console.table(
                    "arrayOfPromises on /offer/publish (POST):",
                    arrayOfPromises
                  );
                  //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
                  const result = await Promise.all(arrayOfPromises);
                  // console.log(
                  //   "resultPromise on /offer/publish (POST):",
                  //   result
                  // );
                  //**** stocker les informations des images dans req ****//
                  req.uploadMultiFile = await result;
                  // console.log(
                  //   "req.uploadMultiFile on /offer/publish (POST):",
                  //   req.uploadMultiFile
                  // );
                } else {
                  res.status(400).json({
                    message:
                      " one/many image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                  });
                }
              }
            } else {
              if (picUpload.size < 10485760) {
                // console.log(
                //   "picUpload.size after if on /offer/publish (POST):",
                //   picUpload.size
                // );
                //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
                const result = await cloudinary.uploader.upload(
                  convertToBase64(picUpload),
                  {
                    folder: "vintaid/offer/" + newOffer._id,
                  }
                );
                console.log(
                  "resultnotPromise on /offer/publish (POST):",
                  result
                );
                //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
                req.uploadOneFile = await result;
                // console.log(
                //   "req.uploadOneFile on /offer/publish (POST):",
                //   req.uploadOneFile
                // );
              } else {
                res.status(400).json({
                  message:
                    "image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                });
              }
            }
          } else {
            return res
              .status(400)
              .json({ message: "bad request, please check your input" });
          }
        } catch (error) {
          //**** si le try echoue (erreur server), on retourne une erreur ****//
          console.log(
            "error on /offer/publish (POST):",
            error,
            "\n",
            "error.message on /offer/publish (POST):",
            error.message
          );
        }
        // console.log("newOffer._id on /offer/publish (POST):", newOffer._id);

        if (req.uploadOneFile || req.uploadMultiFile) {
          newOffer.product_image = req.uploadOneFile;
          newOffer.product_pictures = req.uploadMultiFile;
        }
        // console.log(
        //   "newOffer.product_image before newOffer.save() on /offer/publish (POST):",
        //   newOffer.product_image
        // );
        // console.log(
        //   "newOffer.product_pictures before newOffer.save() on /offer/publish (POST):",
        //   newOffer.product_pictures
        // );
        await newOffer.save();
        // console.log("newOffer after Save on /offer/publish (POST):", newOffer);
        return res.status(201).json({ newOffer, message: "produit crée" });
      } else {
        res.status(400).json({ message: "aucune valeur dans les champs" });
      }
    } catch (error) {
      console.log(error);
      console.log(error.status);
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
