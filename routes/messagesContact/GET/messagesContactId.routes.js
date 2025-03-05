const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Contact = require("../../../models/Contact");

router.get("/messagesContactId/:id", async (req, res) => {
  console.log("je suis sur la route messagesContactId/:id (GET)");

  try {
    const id = req.params.id;
    console.log("id on /messagesContactId/:id:", id);
    if (id) {
      const mssgId = await Contact.findById(id).populate({
        path: "owner",
        select: "account email",
      });
      console.log("mssgId on /messagesContactId/:id:", mssgId);
      if (mssgId) {
        return res.status(200).json(mssgId);
      }
    }
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
