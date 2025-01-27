const mongoose = require("mongoose");

const Responses = mongoose.model("Responses", {
  text: {
    type: String,
    maxLength: 500,
    required: true,
  },
  date: {
    type: String,
  },
  messages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
