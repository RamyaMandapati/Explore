const user = require("../models/user");
const mongoose = require("mongoose");
const { followNotification } = require("./notificationModule");
// update Preference
const updateUserPreference = async (req, res) => {
  try {
    const { interestedActivity, userId, country, city, state } = req.body;
    console.log(userId);
    const updatedUserPreference = await user.findOneAndUpdate(
      { _id: userId },
      {
        interestedActivity: interestedActivity,
        country: country,
        city: city,
        state: state,
      },
      { new: true }
    );
    console.log(updatedUserPreference);
    // Check if the user was found and updated
    if (updatedUserPreference) {
      res.status(200).json({ success: true, data: updatedUserPreference });
    } else {
      res.status(404).json({ success: false, message: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const findUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDetail = await user.findOne({ _id: userId });
    if (!userDetail) {
      return res.status(400).send({
        error: "No user with this id has account with us",
      });
    }
    return res.status(200).json(userDetail);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const findUserByEmail = async (req, res) => {
  try {
    console.log(req.body.email);
    const { email } = req.body;

    const userDetail = await user.findOne({ email }).populate("followers").populate('following');
    if (!userDetail) {
      return res.status(400).send({
        error: "No user with this email has account with us",
      });
    }
    return res.status(200).send(userDetail);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//router.post('/follow/:userIdToFollow', async (req, res) => {
const updateFollowers = async (req, res) => {
  console.log(req.body);
  const currentUserId = req.body.currentUserId; // Assume you get this from session or token
  const userIdToFollow = req.params.userIdToFollow;

  if (currentUserId === userIdToFollow) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    // Convert string IDs to mongoose ObjectId
    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId);

    const userIdToFollowObj = new mongoose.Types.ObjectId(userIdToFollow);

    // Start a session and transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    // Add the current user to the followers list of the user they want to follow
    const userToFollow = await user.findByIdAndUpdate(
      userIdToFollowObj,
      { $addToSet: { followers: currentUserIdObj } }, // Use $addToSet to avoid duplicates
      { new: true, session }
    );

    // Add the other user to the following list of the current user
    const currentUser = await user.findByIdAndUpdate(
      currentUserIdObj,
      { $addToSet: { following: userIdToFollowObj } }, // Use $addToSet to avoid duplicates
      { new: true, session }
    );

    followNotification(currentUserId, userIdToFollow, "FOLLOW");
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Followed successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while following the user" });
  }
};

const savePost = async (req, res) => {
  const currentUserId = req.body.currentUserId;
  const postId = req.params.postId;
  user
    .updateOne({ _id: currentUserId }, { $addToSet: { savedPosts: postId } })
    .then((result) => {
      console.log("Post added to savedPosts", result);
    })
    .catch((error) => {
      console.error("Error saving post", error);
    });
};

const interestedActivity = async (req, res) => {
  try {
    const { interestedActivity, userId } = req.body;
    
    if (!interestedActivity) {
      return res.status(400).json({ message: "Interested activity is required." });
    }

    // Assuming interestedActivity is an array of strings
    const users = await user.find({
      interestedActivity: { $in: interestedActivity },
        // Exclude the logged-in user
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
  updateUserPreference,
  findUserByEmail,
  updateFollowers,
  savePost,
  findUserById,
  interestedActivity,
};
