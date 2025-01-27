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

//utils
const createToken = require("../../../utils/createToken.js");

router.put("/users/:id", isAuthenticated, fileUpload(), async (req, res) => {
  // console.log("je suis sur la route /users/:id (PUT):");

  try {
    // console.log("req.body in PUT /users/:id:", req.body);
    //faire une recherche de l'user par l'id de l'user.
    // let { pictures, username, email, isAdmin, newsletter, userId } = req.body;
    console.log("req.files", req.files);

    let pictures;
    let username;
    let email;
    let isAdmin;
    let newsletter;
    const id = req.params.id;
    // console.log("userId in /users/:id (PUT):", id);
    // console.log(
    //   "mongoose.Types.ObjectId.isValid(id):",
    //   mongoose.Types.ObjectId.isValid(id)
    // );
    const findUserId = await User.findById(id);
    console.log("findUserId in /users/:id (PUT):", findUserId);
    if (
      req.files !== null ||
      req.body.username !== "null" ||
      req.body.email !== "null" ||
      req.body.newsletter !== "null" ||
      req.body.isAdmin !== "null"
    ) {
      if (req.files !== null) {
        if (req.files.pictures.size < 10485760) {
          const pictureToUpload = req.files.pictures;
          console.log("pictureToUpload in /users/:id (PUT):", pictureToUpload);
          const result = await cloudinary.uploader.upload(
            convertToBase64(pictureToUpload),
            {
              folder: "vinted/users/" + findUserId._id,
            }
          );
          findUserId.account.avatar = result;
          console.log(
            "findUserId.account.avatar in /users/:id (PUT):",
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
        console.log("username2 in /users/:id (PUT):", username);
        findUserId.account.username = username;
      }
      if (req.body.email !== "null") {
        email = req.body.email;
        console.log("email2 in /users/:id (PUT):", email);
        findUserId.email = email;
      }
      if (req.body.newsletter !== "null") {
        if (req.body.newsletter === "false" && findUserId.newsletter === true) {
          newsletter = false;
          console.log("newsletter1 in /users/:id (PUT):", newsletter);
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
          console.log("newsletter2 in /users/:id (PUT):", newsletter);
          findUserId.newsletter = newsletter;
        }
      }
      if (req.body.isAdmin !== "null") {
        if (req.body.isAdmin === "true" && findUserId.isAdmin === false) {
          console.log("isAdmin1 in /users/:id (PUT):", isAdmin);
          isAdmin = true;
          findUserId.isAdmin = isAdmin;
        } else if (
          req.body.isAdmin === "false" &&
          findUserId.isAdmin === true
        ) {
          isAdmin = false;
          console.log("isAdmin2 in /users/:id (PUT):", isAdmin);
          findUserId.isAdmin = isAdmin;
        }
      }
      const token = jwt.sign(
        {
          _id: findUserId.id,
          account: findUserId.account,
          isAdmin: findUserId.isAdmin,
          newsletter: findUserId.newsletter,
        },
        process.env.SRV_KEY_SECRET
      );
      findUserId.token = token;
      const { accessToken, refreshToken } = await createToken(findUserId);
      findUserId.token = accessToken;
      await findUserId.save();
      res.cookie("refreshTokenV", refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessTokenV", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // res.cookie("refreshTokenV", refreshToken, {
      //   httpOnly: false,
      //   secure: false, // mettre à true en prod
      //   sameSite: "lax", // mettre à strict en prod
      //   maxAge: 2 * 24 * 60 * 60 * 1000, // 2j
      // });
      // res.cookie("accessTokenV", accessToken, {
      //   httpOnly: false,
      //   secure: false, // mettre à true en prod
      //   sameSite: "lax", // mettre à strict en prod
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7j
      // });
      // console.log(
      //   "accessToken in /users/:id (PUT):",
      //   accessToken,
      //   "\n",
      //   "refreshToken in /users/:id (PUT):",
      //   refreshToken
      // );
      res.status(200).json({ message: "profile updated" });
    }
  } catch (error) {
    console.log("error:", error);
  }
});

router.delete("/users/:id", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route in /users/:id (DELETE):");
  const id = req.params.id;
  console.log("id in /users/:id (DELETE)::", id);
  const findUserByID = await User.findById(id);
  console.log("findUserByID in /users/:id (DELETE)::", findUserByID);
  try {
    if (mongoose.Types.ObjectId.isValid(findUserByID)) {
      await User.findByIdAndDelete(id);
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  res.status(200).json({ message: "user deleted" });
});

module.exports = router;
