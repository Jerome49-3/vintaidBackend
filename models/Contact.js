const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  categorie: {
    type: String,
  },
  subject: {
    type: String,
  },
  messageContact: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
});

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
