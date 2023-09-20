const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  senderuserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  receiveruserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  message: { type: String },
  notificationType: { type: String },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("notification", notificationSchema);
