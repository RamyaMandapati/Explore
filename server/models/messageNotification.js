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
    type: mongoose.Schema.Types.ObjectId,
    ref: "message",
  },
  // You can add more fields if needed
});

module.exports = mongoose.model(
  "messageNotification",
  MessageNotificationSchema
);
