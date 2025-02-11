const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../../../middleware/isAuthenticated.js");
const fileUpload = require("express-fileupload");

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
      res.status(400).json({ message: "objectID not valid" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  res.status(200).json({ message: "user deleted" });
});

module.exports = router;
