const mongoose = require("mongoose");
const { object } = require("zod");

const Messages = mongoose.model("Messages", {
  text: {
    type: String,
    maxLength: 500,
    required: true,
  },
  date: {
    type: String,
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  buyerObj: {
    type: Object,
  },
});
module.exports = Messages;
