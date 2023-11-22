const notification = require("../models/notification");
const itinerary = require("../models/itinerary");
const everything = require("../index");

const user = require("../models/user");
// member notification
const memberNotification = async (
  itineraryId,
  userId,
  member,
  itineraryName,
  action
) => {
  try {
    const userDet = await user.findById(userId);
    const memberDet = await user.findById(member);

    let message = "";
    let notificationList = [];

    switch (action) {
      case "REQUEST":
        message = `${memberDet.userName} requested you for trip: ${itineraryName}`;
        break;
      case "ADD":
        message = `${userDet.userName} added you for trip: ${itineraryName}`;
        break;
      case "REJECT":
        message = `${userDet.userName} rejected your request for trip: ${itineraryName}`;
        break;
      case "REMOVE":
        message = `${userDet.userName} removed you from trip: ${itineraryName}`;
        break;
      default:
        throw new Error("Invalid action");
    }
    notificationList = [
      {
        senderuserId: action === "REQUEST" ? member : userId,
        receiveruserId: action === "REQUEST" ? userId : member,
        message: message,
        itineraryId: itineraryId,
        notificationType:
          action === "REQUEST" ? "ITINERARY_REQUEST" : "ITINERARY_NOTIFICATION",
      },
    ];

    const createdNotifications = await notification.insertMany(
      notificationList
    );
    for (const notification of createdNotifications) {
      await everything.emitNotification(
        notification.receiveruserId,
        notification
      );
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const itineraryNotification = async (itineraryId, userId, action) => {
  try {
    const itineraryDet = await itinerary.findById(itineraryId);
    const userDet = await user.findById(userId);
    let message = `${userDet.userName} ${action.toLowerCase()}d ${
      itineraryDet.itineraryName
    }`;

    let members = itineraryDet.members;
    members.splice(members.indexOf(userId), 1);
    let notificationList = [];
    for (const member of members) {
      notificationList.push({
        senderuserId: userId,
        receiveruserId: member,
        message: message,
        itineraryId: itineraryId,
        notificationType: "ITINERARY_NOTIFICATION",
      });
    }
    const createdNotifications = await notification.insertMany(
      notificationList
    );
    for (const notification of createdNotifications) {
      await everything.emitNotification(
        notification.receiveruserId,
        notification
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const followNotification = async (userId, member, action) => {
  try {
    const userDet = await user.findById(userId);
    let message = "";

    if (action === "FOLLOW") {
      message = `${userDet.userName} is following you.`;
    }

    let notificationList = [];
    notificationList.push({
      senderuserId: userId,
      receiveruserId: member,
      message: message,
    });

    const createdNotifications = await notificationModel.insertMany(
      notificationList
    );
    for (const notification of createdNotifications) {
      await everything.emitNotification(
        notification.receiveruserId,
        notification
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const readNotification = async (req, res) => {
  try {
    let notificationDet = await notification.findById(req.body.notificationId);
    notificationDet.isRead = true;
    const updatedNotification = await notificationDet.save();
    res.status(200).json({ notification: updatedNotification, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notification.deleteOne({ _id: req.params.id });
    res.status(200).send("Notification Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await notification
      .find({ receiveruserId: req.params.id })
      .sort({ timestamp: -1 });
    res.status(200).json({ data: notifications });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  memberNotification,
  itineraryNotification,
  followNotification,
  readNotification,
  deleteNotification,
  getNotifications,
};
