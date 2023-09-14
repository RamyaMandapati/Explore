const itinerary = require("../models/itinerary");

const addItinerary = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      destination,
      interests,
      budget,
      userId,
      itineraryId,
      members,
      itineraryList,
      tags,
    } = req.body;
    // const endDateMs = new Date(endDate).getTime();
    // const startDateMs = new Date(startDate).getTime();
    // const duration =
    //   Math.ceil((endDateMs - startDateMs) / (1000 * 3600 * 24)) + 1;
    // if (!(location && duration)) {
    //   res.status(400).send("Mandatory fields missing");
    // }

    const itineraryObject = {
      itineraryName: `Trip to ${destination}`,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      budget: budget,
      interests: interests,
      itineraryList: itineraryList,
      tags: tags,
    };
    let savedItinerary;
    if (itineraryId) {
      itineraryObject.members = members;
      itineraryObject.updatedTimestamp = Date.now;
      savedItinerary = await itinerary.findOneAndUpdate(
        { _id: itineraryId },
        { $set: itineraryObject },
        { upsert: true, new: true }
      );
    } else {
      itineraryObject.createdBy = userId;
      itineraryObject.members = [userId];
      const itineraryModel = new itinerary(itineraryObject);
      savedItinerary = await itineraryModel.save();
      //   const owner = await userModel
      //     .findOne({ _id: itineraryObject.createdBy })
      //     .select("username email");
      //   savedItinerary.members = [owner];
      //   savedItinerary.createdBy = owner;
    }
    res.status(200).send(savedItinerary);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Unable to generate itinerary. Please try again in sometime");
  }
};

module.exports = {
  addItinerary,
};
