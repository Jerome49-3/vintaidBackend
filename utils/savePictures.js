const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("./convertToBase64");

const savePictures = async (req, res) => {
  if (req.files.pictures) {
    console.log("req.files.pictures on savePictures:", req.files.pictures);
    const picUpload = req.files.pictures;
    console.log("picUpload on savePictures:", picUpload);
    const arrayPictures = Array.isArray(picUpload);
    console.log("arrayPictures on savePictures:", arrayPictures);
    try {
      if (arrayPictures !== false) {
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
              return cloudinary.uploader.upload(convertToBase64(picture), {
                folder: "vinted/offers/" + newOffer._id,
              });
            });
            console.log(
              "arrayOfPromises on /offer/publish (POST):",
              arrayOfPromises
            );
            //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
            const result = await Promise.all(arrayOfPromises);
            console.log("resultPromise on /offer/publish (POST):", result);
            //**** stocker les informations des images dans req ****//
            req.uploadMultiFile = await result;
            console.log(
              "req.uploadMultiFile on /offer/publish (POST):",
              req.uploadMultiFile
            );
          } else {
            res.status(400).json({
              message:
                " one/many image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
            });
          }
        }
      } else {
        if (picUpload.size < 10485760) {
          console.log(
            "picUpload.size after if on /offer/publish (POST):",
            picUpload.size
          );
          //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
          const result = await cloudinary.uploader.upload(
            convertToBase64(picUpload),
            {
              folder: "vinted/offers/" + newOffer._id,
            }
          );
          console.log("resultnotPromise on /offer/publish (POST):", result);
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
      }
    } catch (error) {
      console.log("error in savePictures.js:", error);
    }
  }
};

module.exports = savePictures;
