const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../../../utils/convertToBase64.js");
const { message } = require("statuses");
const jwt = require("jsonwebtoken");

//models
const User = require("../../../models/User.js");

router.put("/profile/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /profile/:id (PUT)");

  try {
    // console.log("req.body in PUT /users/:id:", req.body);
    //faire une recherche de l'user par l'id de l'user.
    // let { pictures, username, email, isAdmin, newsletter, userId } = req.body;
    console.log("req.files in /profile/:id (PUT):", req.files);

    let pictures;
    let username;
    let email;
    let newsletter;
    const id = req.params.id;
    console.log("userId in /profile/:id (PUT):", id);
    console.log(
      "mongoose.Types.ObjectId.isValid(id):",
      mongoose.Types.ObjectId.isValid(id)
    );
    const findUserId = await User.findById(id);
    console.log("findUserId in /profile/:id (PUT):", findUserId);
    if (
      req.files !== null ||
      req.body.username !== "null" ||
      req.body.email !== "null" ||
      req.body.newsletter !== "null"
    ) {
      if (req.files !== null) {
        if (req.files.pictures.size < 10485760) {
          const pictureToUpload = req.files.pictures;
          console.log(
            "pictureToUpload in /profile/:id (PUT):",
            pictureToUpload
          );
          const result = await cloudinary.uploader.upload(
            convertToBase64(pictureToUpload),
            {
              folder: "vinted/users/" + findUserId._id,
            }
          );
          findUserId.account.avatar = result;
          console.log(
            "findUserId.account.avatar in /profile/:id (PUT):",
            findUserId.account.avatar
          );
        } else {
          res
            .status(400)
            .json({ message: "image size too large, max: 10485760 bytes" });
        }
      }
      if (req.body.username !== "null") {
        username = req.body.username;
        console.log("username2 in /profile/:id (PUT):", username);
        findUserId.account.username = username;
      }
      if (req.body.email !== "null") {
        email = req.body.email;
        console.log("email2 in /profile/:id (PUT):", email);
        findUserId.email = email;
      }
      if (req.body.newsletter !== "null") {
        if (req.body.newsletter === "false" && findUserId.newsletter === true) {
          newsletter = false;
          console.log("newsletter1 in /profile/:id (PUT):", newsletter);
          // console.log(
          //   "typeof req.body.newsletter1 in PUT /users/:id:",
          //   typeof req.body.newsletter
          // );
          // console.log("newsletter1 in PUT /users/:id:", newsletter);
          // console.log("typeof newsletter1 in PUT /users/:id:", typeof newsletter);
          findUserId.newsletter = newsletter;
        } else if (
          req.body.newsletter === "true" &&
          findUserId.newsletter === false
        ) {
          newsletter = true;
          console.log("newsletter2 in /profile/:id (PUT):", newsletter);
          findUserId.newsletter = newsletter;
        }
      }
      const { accessToken, refreshToken } = await createToken(findUserId);
      findUserId.token = accessToken;
      await findUserId.save();
      res.status(200).json({ message: "profile updated" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

router.delete("/profile/:id", async (req, res) => {
  console.log("je suis sur la route /profile/:id (DELETE)");
  const id = req.params.id;
  console.log("id in /profile/:id (DELETE)", id);
  const findUserByID = await User.findById(id);
  console.log("findUserByID in /profile/:id (DELETE)", findUserByID);

  try {
    if (mongoose.Types.ObjectId.isValid(findUserByID)) {
      await User.findByIdAndDelete(id);
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
