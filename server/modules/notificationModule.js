const notification = require("../models/notification");
const itinerary = require("../models/itinerary");
const user = require("../models/user");
// member notification
const memberNotification = async (userId, member, itineraryName, action) => {
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
        message = `${userDet.username} removed you from trip: ${itineraryName}`;
        break;
      default:
        throw new Error("Invalid action");
    }
    notificationList = [
      {
        senderuserId: action === "REQUEST" ? member : userId,
        receiveruserId: action === "REQUEST" ? userId : member,
        message: message,
        notificationType:
          action === "REQUEST" ? "ITINERARY_REQUEST" : "ITINERARY_NOTIFICATION",
      },
    ];

    await notification.insertMany(notificationList);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const itineraryNotification = async (itineraryId, userId, action) => {
  try {
    const itineraryDet = await itinerary.findById(itineraryId);
    const userDet = await user.findById(userId);
    let message = `${userDet.username} ${action.toLowerCase()}d ${
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
        notificationType: "ITINERARY_NOTIFICATION",
      });
    }
    await notificationModel.insertMany(notificationList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  memberNotification,
  itineraryNotification,
};
