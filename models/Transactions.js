const mongoose = require("mongoose");

const Transactions = mongoose.model("Transactions", {
  product_name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  product_price: {
    type: Number,
    max: 100000,
    required: true,
  },
  seller: Object,
  buyer: Object,
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyer_address: Object,
  date: {
    type: String,
  },
  number_command: {
    type: String,
  },
});
module.exports = Transactions;
