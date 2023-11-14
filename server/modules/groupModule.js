const itineraryModel = require("../models/itinerary.js");
const { memberNotification } = require("./notificationModule.js");
const mongoose = require("mongoose");

const editMember = async (req, res) => {
  try {
    const { itineraryId, userId, members } = req.body;
    console.log(members);
    const query = { _id: itineraryId };
    // const memberIds = members.split(",")
    const itinerary = await itineraryModel.findOne(query);
    if (itinerary) {
      if (userId != itinerary.createdBy) {
        res.status(401).send("Unauthorized Access");
      } else {
        let existingMembers = itinerary.members;
        members.forEach(async (m) => {
          if (!existingMembers.includes(new mongoose.Types.ObjectId(m))) {
            await memberNotification(
              itineraryId,
              userId,
              m,
              itinerary.itineraryName,
              "ADD"
            );
          }
        });

        existingMembers.forEach(async (em) => {
          if (!members.includes(em.toString())) {
            await memberNotification(
              itineraryId,
              userId,
              em,
              itinerary.itineraryName,
              "REMOVE"
            );
          }
        });
        itinerary.members = members;
        const newItinerary = await itinerary.save();
        res.status(200).json(newItinerary);
      }
    } else {
      res.send(400).send("Itinerary not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  editMember,
};
