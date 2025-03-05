const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const fileUpload = require("express-fileupload");

//middleware
const isAuthenticated = require("../../../middleware/isAuthenticated");

//models
const Contact = require("../../../models/Contact");

//lib
const sendEmailContact = require("../../../utils/sendEmailContact");

router.post(
  "/messagesContactId/:id",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("je suis sur la route /messagesContactId/:id (POST)");

    try {
      const { reply } = req.body;
      console.log("reply in /messagesContactId/:id:", reply);
      const id = req.params.id;
      if (id) {
        const mssgId = await Contact.findById(id).populate({
          path: "owner",
          select: "account email",
        });
        console.log("mssgId on /messagesContactId/:id:", mssgId);
        const subject = "you have a reply of Vintaid";

        if (mssgId) {
          const sendReply = await sendEmailContact(
            mssgId?.owner?.account?.username,
            mssgId?.owner?.email,
            subject,
            reply
          );
          console.log("sendReply in /messagesContactId/:id:", sendReply);
          return res.status(200).json({ success: "reply posted" });
        }
      }
    } catch (error) {
      console.log("error in /messagesContactId/:id:", error);
    }
  }
);

module.exports = router;
