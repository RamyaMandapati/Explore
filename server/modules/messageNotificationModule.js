const messageNotification = require("../models/messageNotification");
const func = require("../index");

const saveMessageNotification = async (conversationId, receiverId, text) => {
  try {
    let notification = await messageNotification.findOneAndUpdate(
      { conversationId: conversationId, userId: receiverId },
      { $inc: { unreadCount: 1 }, lastMessage: text },
      { upsert: true, new: true }
    );
    await func.messageNotification(receiverId, notification);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getMessageNotification = async (req, res) => {
  try {
    const notifications = await messageNotification.find({
      userId: req.params.userId,
    });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  saveMessageNotification,
  getMessageNotification,
};
