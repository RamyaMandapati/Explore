import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  receiverUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  message: { type: String },
  notificationType: { type: String },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

const notification = mongoose.model("notification", notificationSchema);

export default notification;
