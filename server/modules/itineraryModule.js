const itinerary = require('../models/itinerary');
const user = require('../models/user');
const {
  memberNotification,
  itineraryNotification,
} = require('./notificationModule.js');
const mongoose = require('mongoose');
const notification = require('../models/notification');
const { update } = require('tar');
const { openaiquery } = require('../utils/openai.js');

// save the itinerary
const addItinerary = async (req, res) => {
  try {
    const {
      startDate,
      itineraryName,
      endDate,
      destination,
      interests,
      budget,
      userId,
      itineraryId,
      members,
      itineraryList,
      nonmembers,
      tags,
      startingLocation,
      imageUrl,
    } = req.body;

    const itineraryObject = {
      itineraryName: itineraryName,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      budget: budget,
      interests: interests,
      itineraryList: itineraryList,
      startingLocation: startingLocation,
      tags: tags,
      imageUrl: imageUrl,
    };
    let savedItinerary;
    if (itineraryId) {
      itineraryObject.members = members;
      itineraryObject.nonmembers = nonmembers;
      itineraryObject.updatedTimestamp = Date.now();
      savedItinerary = await itinerary.findOneAndUpdate(
        { _id: itineraryId },
        { $set: itineraryObject },
        { upsert: true, new: true }
      );
      await itineraryNotification(itineraryId, userId, 'UPDATE');
    } else {
      itineraryObject.createdBy = userId;
      members.push(userId);
      itineraryObject.members = members;
      itineraryObject.nonmembers = nonmembers;
      const itineraryModel = new itinerary(itineraryObject);
      savedItinerary = await itineraryModel.save();
      await itineraryNotification(savedItinerary._id, userId, 'ADDE');
    }
    const owner = await user
      .findOne({ _id: itineraryObject.createdBy })
      .select('userName email');
    savedItinerary.members = [owner];
    savedItinerary.createdBy = owner;
    res.status(200).json({ itinerary: savedItinerary, success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send('Unable to generate itinerary. Please try again in sometime');
  }
};

const generate = async (req, res) => {
  try {
    const { startDate, endDate, destination, interests, budget } = req.body;
    const endDateMs = new Date(endDate).getTime();
    const startDateMs = new Date(startDate).getTime();
    const duration =
      Math.ceil((endDateMs - startDateMs) / (1000 * 3600 * 24)) + 1;
    if (!(destination && duration)) {
      res.status(400).send('Mandatory fields missing');
    }

    var prompt = `Generate a ${duration}-day itinerary for a trip to ${destination}. 
    The itinerary should have a budget of ${budget} and include activities related to ${interests}. 
    The response should be in JSON format which includes the following fields-  Response should be in JSON format as a list of dictionaries.
    Each dictionary will have 2 fields - "day"(in number) and "places". 
    The value places should be a list of dictionaries containing fields- "placeName", "lat", "lng", "desc", "cost"(in USD), "startTime", "endTime", "category".
    The itinerary should be distance efficient with minimum travel time in a day. Arrange the places in order it should be visited.
    Reply with only the answer in JSON form and include no other commentary.
    Limit the output to less than 1000 tokens.`;

    console.log(prompt);

    const itinerary = await openaiquery(prompt);
    console.log(itinerary);

    res.status(200).send(itinerary);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send('Unable to generate itinerary. Please try again in sometime');
  }
};

// display itinerary details by itinerary id
const getItineraryById = async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const query = { _id: itineraryId };

    const itineraryData = await itinerary.findOne(query, {}, { lean: true });
    const memberInfo = [];
    await Promise.all(
      itineraryData.members.map(async (member) => {
        const memberData = await user
          .findOne({ _id: member })
          .select('userName email');
        memberInfo.push(memberData);
      })
    );
    const owner = await user
      .findOne({ _id: itineraryData.createdBy })
      .select('userName email profilePhoto');
    itineraryData.members = memberInfo;
    itineraryData.createdBy = owner;
    const userId = req.user._id;
    itineraryData.userRated = itineraryData.itineraryRating.users.some((user) =>
      user.equals(userId)
    );
    itineraryData.userLike = itineraryData.likes.users.some((user) =>
      user.equals(userId)
    );
    itineraryData.request = itineraryData.requestedMembers.some((user) =>
      user.equals(userId)
    );
    itineraryData.member = itineraryData.members.some((user) =>
      user.equals(userId)
    );
    res.status(200).json({ success: true, itinerary: itineraryData });
  } catch (e) {
    console.log(e);
    res.status(500).send('Unable to fetch itinerary');
  }
};

// display all itineraries based on the location search

const getItineraries = async (req, res) => {
  try {
    let { destination, pageSize, page } = req.query;
    const query = {};
    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }
    if (!pageSize) {
      pageSize = 10;
    }
    if (!page) {
      page = 1;
    }
    const itineraries = await itinerary
      .find(query, {}, { lean: true })
      .sort({ 'likes.likecount': -1 })
      .populate('createdBy')
      .limit(pageSize * 1)
      .skip(pageSize * (page - 1))
      .exec();
    res.status(200).json({ data: itineraries });
  } catch (e) {
    console.log(e);
    res.status(500).send('Unable to fetch itinerary');
  }
};

// display all itineraries belongs to each user
const getItineraryByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const query = [{ createdBy: userId }, { members: { $in: [userId] } }];
    const itineraryDetails = await itinerary
      .find({ $or: query }, {}, { lean: true })
      .populate('createdBy')
      .populate('members');
    res.status(200).json({ data: itineraryDetails });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// add members to itinerary
const itineraryMembers = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itineraryId, memberId, type, notificationId } = req.body;
    const itineraryDet = await itinerary.findById(itineraryId);
    if (!itineraryDet) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: 'Itinerary not found' });
    }
    if (type === 'ACCEPT') {
      // Remove the new member from requestedMembers
      itineraryDet.requestedMembers.pull(memberId);
      // Add the new member to members
      itineraryDet.members.push(memberId);
    } else if (type === 'REJECT') {
      // Remove the new member from requestedMembers
      itineraryDet.requestedMembers.pull(memberId);
    } else {
      res.status(404).json({ message: 'type is incorrect' });
    }
    // Save the changes to the itinerary
    itineraryDetails = await itineraryDet.save();

    const notificationType = type === 'ACCEPT' ? 'ADD' : 'REJECT';
    await memberNotification(
      itineraryId,
      itineraryDet.createdBy,
      memberId,
      itineraryDet.itineraryName,
      notificationType
    );

    const updatedNotification = await notification.findByIdAndUpdate(
      { _id: notificationId },
      {
        notificationType: `ITINERARY_${type}`,
        isRead: true,
      },
      { new: true }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ notification: updatedNotification, success: true });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.log(e);
    res.status(500).json({ error: 'An error occurred' + e });
  }
};

// users requesting for itinerary to join
const itineraryAccessRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itineraryId, memberId } = req.body;
    const itineraryDet = await itinerary.findById(itineraryId);
    if (!itineraryDet) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: 'Itinerary not found' });
    }
    itineraryDet.requestedMembers.push(memberId);

    const updatedItinerary = await itineraryDet.save();

    memberNotification(
      itineraryId,
      itineraryDet.createdBy,
      memberId,
      itineraryDet.itineraryName,
      'REQUEST'
    );
    await session.commitTransaction();
    session.endSession();
    // Check if the itinerary was found and updated
    if (updatedItinerary) {
      res.status(200).json({ itinerary: updatedItinerary, success: true });
    } else {
      res.status(404).json({ message: 'Itinerary not found' });
    }
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.log(e);
    res.status(500).send(e);
  }
};

// add itinerary to favorites
const favoriteItinerary = async (req, res) => {
  try {
    const { itineraryId, userId } = req.body;
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $push: { isFavoriteItinerary: itineraryId } },
      { new: true }
    );
    // Check if the user was found and updated
    if (updatedUser) {
      res.status(200).json({ data: updatedUser });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// remove itinerary from favorites
const deletefavoriteItinerary = async (req, res) => {
  try {
    const { itineraryId, userId } = req.body;
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $pull: { isFavoriteItinerary: itineraryId } },
      { new: true }
    );
    // Check if the user was found and updated
    if (updatedUser) {
      res.status(200).json({ data: updatedUser });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// itinerary likes count
const itineraryLikeCount = async (req, res) => {
  try {
    const { itineraryId, userId } = req.body;
    const updatedItinerary = await itinerary.findByIdAndUpdate(
      itineraryId,
      {
        $push: { 'likes.users': userId },
        $inc: { 'likes.likecount': 1 }, // Increment likecount by 1
      },
      { new: true }
    );

    if (updatedItinerary) {
      const itineraryObject = updatedItinerary.toObject();

      itineraryObject.userLike = true;
      itineraryObject.userRated = itineraryObject.itineraryRating.users.some(
        (user) => user.equals(userId)
      );
      itineraryObject.request = itineraryObject.requestedMembers.some((user) =>
        user.equals(userId)
      );
      itineraryObject.member = itineraryObject.members.some((user) =>
        user.equals(userId)
      );
      res.status(200).json({ success: true, itinerary: itineraryObject });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// itinerary rating
const itineraryRating = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { itineraryId, userId, userRating } = req.body;
    const itineraryDet = await itinerary.findById(itineraryId);

    if (!itineraryDet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    // Update the itineraryRating subdocument
    itineraryDet.itineraryRating.users.push(userId); // Add the user to the users array
    itineraryDet.itineraryRating.totalcount += 1; // Increment totalcount
    itineraryDet.itineraryRating.totalrating += userRating; // Add user's rating to totalrating
    const averageRating =
      itineraryDet.itineraryRating.totalrating /
      itineraryDet.itineraryRating.totalcount;

    itineraryDet.itineraryAvgRating = averageRating;

    // Save the updated itinerary
    const updatedItinerary = await itineraryDet.save();

    await session.commitTransaction();
    session.endSession();
    // Calculate the new average rating based on totalcount
    res.status(200).json({ itinerary: updatedItinerary, success: true });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.log(e);
    res.status(500).send(e);
  }
};

// itinerary likes count
const removeItineraryLikeCount = async (req, res) => {
  try {
    const { itineraryId, userId } = req.body;
    const updatedItinerary = await itinerary.findByIdAndUpdate(
      itineraryId,
      {
        $pull: { 'likes.users': userId },
        $inc: { 'likes.likecount': -1 }, // decrement likecount by 1
      },
      { new: true }
    );

    if (updatedItinerary) {
      const itineraryObject = updatedItinerary.toObject();

      itineraryObject.userLike = false;
      itineraryObject.userRated = itineraryObject.itineraryRating.users.some(
        (user) => user.equals(userId)
      );
      itineraryObject.request = itineraryObject.requestedMembers.some((user) =>
        user.equals(userId)
      );
      itineraryObject.member = itineraryObject.members.some((user) =>
        user.equals(userId)
      );
      res.status(200).json({ success: true, itinerary: itineraryObject });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
// add members
module.exports = {
  addItinerary,
  getItineraryById,
  getItineraries,
  getItineraryByUserId,
  itineraryMembers,
  favoriteItinerary,
  deletefavoriteItinerary,
  itineraryAccessRequest,
  itineraryLikeCount,
  removeItineraryLikeCount,
  itineraryRating,
  generate,
};
