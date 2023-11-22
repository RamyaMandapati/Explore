const Conversation = require("../models/conversation");
const Message = require("../models/message");

const saveConversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get conv of a user

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get conv includes two userId

const getConversationTwoUserIds = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    let unreadCounts = [];

    // Find all conversations for the user
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    // Iterate through each conversation and count unread messages
    for (const conversation of conversations) {
      const count = await Message.countDocuments({
        conversationId: conversation._id,
        sender: { $ne: userId },
        read: false,
      });
      unreadCounts.push({
        conversationId: conversation._id,
        unreadCount: count,
      });
    }
    res.json(unreadCounts);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
  saveConversation,
  getConversation,
  getConversationTwoUserIds,
  getUnreadMessageCount,
};
