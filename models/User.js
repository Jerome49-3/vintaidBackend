const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  account: {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      default:
        "https://res.cloudinary.com/djk45mwhr/image/upload/fl_preserve_transparency/v1718626269/tjognak2go4rnl4dl1xl.jpg?_s=public-apps",
    },
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  becomeAdmin: {
    type: Boolean,
    default: false,
  },
  emailIsConfirmed: {
    type: Boolean,
    default: false,
  },
  loginFailed: {
    type: Number,
    default: null,
  },
  lockDate: {
    type: Date,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  lockUntil: {
    type: Date,
  },
  code: {
    type: String,
  },
  date: {
    type: String,
  },
  tokenIsValid: {
    type: Boolean,
  },
  passwordIsChanged: {
    passwordChangedAt: {
      type: Date,
    },
    passwordChanged: {
      type: Boolean,
      default: false,
    },
  },
  stateTk: {
    type: String,
  },
  // createdAt: {
  //   type: Date,
  //   default: () => new Date(Date.now()),
  // },
  // expireAt: {
  //   type: Date,
  //   default: Date.now() + 604800000,
  // },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
