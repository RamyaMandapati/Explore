const mongoose = require("mongoose");

const MessageNotificationSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
  lastMessage: {
    type: String,
  },
  // You can add more fields if needed
});

module.exports = mongoose.model(
  "messageNotification",
  MessageNotificationSchema
);
