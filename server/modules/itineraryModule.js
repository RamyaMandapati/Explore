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

const getItineraryById = async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const query = { _id: itineraryId };

    const itineraryData = await itinerary.findOne(query);
    // const memberInfo = [];
    // await Promise.all(
    //   itineraryData.members.map(async (member) => {
    //     const memberData = await userModel
    //       .findOne({ _id: member })
    //       .select("username email");
    //     memberInfo.push(memberData);
    //   })
    // );
    // const owner = await userModel
    //   .findOne({ _id: itineraryData.createdBy })
    //   .select("username email");
    // itineraryData.members = memberInfo;
    // itineraryData.createdBy = owner;
    res.status(200).send(itineraryData);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to fetch itinerary");
  }
};

const getItineraries = async (req, res) => {
  try {
    const { destination } = req.query;
    const query = {};
    console.log(destination);
    if (destination) {
      query.destination = new RegExp(destination, "i");
    }
    const itineraries = await itinerary
      .find(query)
      .sort({ likeCount: -1 })
      .exec();
    res.status(200).json({ data: itineraries });
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to fetch itinerary");
  }
};

module.exports = {
  addItinerary,
  getItineraryById,
  getItineraries,
};
