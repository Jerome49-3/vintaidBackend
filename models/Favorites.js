const mongoose = require("mongoose");

const Favorites = mongoose.model("Favorites", {
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
module.exports = Favorites;
