const Message = require("../models/message");
const func = require("../index");
const messageNotification = require("../models/messageNotification");
const { saveMessageNotification } = require("./messageNotificationModule");

//add

const saveMessage = async (req, res) => {
  const { sender, text, conversationId, receiverId } = req.body;
  const newMessage = new Message({ sender, text, conversationId });

  try {
    const savedMessage = await newMessage.save();
    // await func.emitMessage(req.body.receiver, savedMessage);\
    await saveMessageNotification(conversationId, receiverId, text);

    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//get

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

const messageMarkAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.body.conversationId,
        sender: { $ne: req.body.receiverId },
      },
      { $set: { isRead: true } }
    );
    let notification = await messageNotification.findOneAndUpdate(
      { conversationId: req.body.conversationId, userId: req.body.userId },
      { $set: { unreadCount: 0 } },
      { new: true }
    );

    await func.messageNotification(req.body.userId, notification);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  saveMessage,
  getMessages,
  messageMarkAsRead,
};
