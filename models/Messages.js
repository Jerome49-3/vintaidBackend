const mongoose = require("mongoose");

const Messages = mongoose.model("Messages", {
  text: {
    type: String,
    maxLength: 500,
    required: true,
  },
  date: {
    type: String,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Messages;
