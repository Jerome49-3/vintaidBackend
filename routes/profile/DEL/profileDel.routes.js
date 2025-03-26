const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

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
