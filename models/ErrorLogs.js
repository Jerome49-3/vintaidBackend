const mongoose = require("mongoose");

const ErrorLogsSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  stack: {
    type: String,
  },
  componentStack: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    index: { expires: "7d" },
  },
});

const ErrorLogs = mongoose.model("ErrorLogs", ErrorLogsSchema);
module.exports = ErrorLogs;
