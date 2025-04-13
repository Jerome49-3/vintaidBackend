const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../../../middleware/isAuthenticated");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

//models
const User = require("../../../models/User");
const Offer = require("../../../models/Offer");

router.delete("/profile/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /profile/:id (DELETE)");
  try {
    console.time("searchUser");
    const userId = req.params.id;
    console.log("userId in /profile/:id (DELETE)", userId);
    const userIdValid = mongoose.Types.ObjectId.isValid(userId);
    console.log("userIdValid in /profile/:id (DELETE)", userIdValid);
    console.timeEnd("searchUser");
    if (userIdValid) {
      //search User by Id
      const findUserByID = await User.findById(userId);
      console.table("findUserByID in /profile/:id (DELETE)", findUserByID);
      //search public_id's picture of avatar
      if (findUserByID) {
        const imgAvatarToDestroy = findUserByID?.account?.avatar?.public_id;
        console.log(
          "imgAvatarToDestroy in /profile/:id (DELETE)",
          imgAvatarToDestroy
        );
        if (
          imgAvatarToDestroy !== undefined &&
          imgAvatarToDestroy.result !== "not found"
        ) {
          try {
            //destroy avatar on cloudinary
            const imgAvatarDestroyed = await cloudinary.uploader.destroy(
              imgAvatarToDestroy,
              {
                invalidate: true,
              }
            );
            console.log(
              "imgAvatarDestroyed in /profile/:id (DELETE)",
              imgAvatarDestroyed
            );
          } catch (error) {
            console.log("error for delete imgAvatarDestroyed:", error);
          }
          if (
            imgAvatarDestroyed !== undefined &&
            imgAvatarDestroyed.result !== "not found"
          ) {
            //search folder's cloudinary
            try {
              const folderAvatarToDestroy =
                findUserByID?.account?.avatar?.folder;
              console.log(
                "folderAvatarToDestroy in /profile/:id (DELETE)",
                folderAvatarToDestroy
              );
              //destroy folder's avatar on cloudinary
              const folderAvatarDestroyed = await cloudinary.api.delete_folder(
                folderAvatarToDestroy,
                {
                  invalidate: true,
                }
              );
              console.log(
                "folderAvatarDestroyed in /profile/:id (DELETE)",
                folderAvatarDestroyed
              );
            } catch (error) {
              console.log("error in delete folderAvatar:", error);
            }
          }
        }
        const findAllOffers = await Offer.find({ owner: userId });
        console.log("findAllOffers in /profile/:id (DELETE)", findAllOffers);
        //for all offer funded if it's funded
        if (findAllOffers) {
          for (let i = 0; i < findAllOffers.length; i++) {
            const offerUser = findAllOffers[i];
            console.log("offerUser in /profile/:id (DELETE)", offerUser);
            const offerUserId = offerUser?._id;
            console.log("offerUserId in /profile/:id (DELETE)", offerUserId);
            //if product_image
            if (offerUser.product_image) {
              //assign the public_id path
              const imgOfferToDestroy = findUserByID?.product_image?.public_id;
              console.log(
                "imgOfferToDestroy in /profile/:id (DELETE)",
                imgOfferToDestroy
              );
              if (
                imgOfferToDestroy !== undefined &&
                imgOfferToDestroy.result !== "not found"
              ) {
                //destroy image
                const imgOfferDestroyed = await cloudinary.uploader.destroy(
                  imgOfferToDestroy,
                  {
                    invalidate: true,
                  }
                );
                console.log(
                  "imgOfferDestroyed in /profile/:id (DELETE)",
                  imgOfferDestroyed
                );
                //assign the folder path
                const folderOfferToDestroy =
                  findUserByID?.product_image?.folder;
                console.log(
                  "folderOfferToDestroy in /profile/:id (DELETE)",
                  folderOfferToDestroy
                );
                //destroy folder's avatar on cloudinary
                const folderOfferDestroyed = await cloudinary.api.delete_folder(
                  folderOfferToDestroy,
                  {
                    invalidate: true,
                  }
                );
                console.log(
                  "folderOfferDestroyed in /profile/:id (DELETE)",
                  folderOfferDestroyed
                );
              }
            } else if (offerUser?.product_pictures) {
              //if offer has product_pictures, i assigne them
              const prodPics = offerUser?.product_pictures;
              //foreach for all pictures funded in prodPics
              prodPics.forEach(async (el) => {
                console.log("el in forEach on /profile (DEL):", el);
                //assign the public_id path
                const imgOfferProdPictsToDestroy = el?.public_id;
                console.log(
                  "imgOfferProdPictsToDestroy in /profile/:id (DELETE)",
                  imgOfferProdPictsToDestroy
                );
                if (
                  imgOfferProdPictsToDestroy !== undefined &&
                  imgOfferProdPictsToDestroy !== "not found"
                ) {
                  const imgOfferProdPictsDestroyed =
                    await cloudinary.uploader.destroy(
                      imgOfferProdPictsToDestroy,
                      {
                        invalidate: true,
                      }
                    );
                  console.log(
                    "imgOfferProdPictsDestroyed in /profile/:id (DELETE)",
                    imgOfferProdPictsDestroyed
                  );
                  //assign the folder path
                  const folderOfferProdPictsToDestroy = el?.folder;
                  console.log(
                    "folderOfferProdPictsToDestroy in /profile/:id (DELETE)",
                    folderOfferProdPictsToDestroy
                  );
                  //destroy folder's avatar on cloudinary
                  const folderOfferProdPictsDestroyed =
                    await cloudinary.api.delete_folder(
                      folderOfferProdPictsToDestroy,
                      {
                        invalidate: true,
                      }
                    );
                  console.log(
                    "folderOfferProdPictsDestroyed in /profile/:id (DELETE)",
                    folderOfferProdPictsDestroyed
                  );
                }
              });
            }
            const offerUserDeleted = await Offer.findByIdAndDelete(offerUserId);
            console.log(
              "offerUserDeleted in /profile/:id (DELETE)",
              offerUserDeleted
            );
          }
        }
        const userDeleted = await User.findByIdAndDelete(userId);
        console.log("userDeleted in /profile/:id (DELETE)", userDeleted);
        res.status(201).json({ infoUser: "account deleted" });
      } else {
        res.status(400).json({ message: "user not found" });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
