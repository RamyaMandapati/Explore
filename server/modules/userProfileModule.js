// const User = require('../models/user');
// const Itinerary = require('../models/itinerary');
// const mongoose = require('mongoose');
// const Post = require('../models/post');

// // Function to save or update user data
// const saveoreditProfile = async (req, res) => {

//   try {
//     const {
//       userName,
//       email,
//       password,
//       emailVerified,
//       dateOfBirth,
//       gender,
//       phoneNumber,
//       identificationProof,
//       profilePhoto,
//       coverPhoto,
//       city,
//       state,
//       country,
//       interestedActivity,
//       followers,
//       following,
//       tripsCreated,
//       isFavoriteItinerary,
//       postsCreated,
//       userReviews,
//       about,
//       bio,
//       views,
//     } = req.body;

//     const userObject = {
//       userName: userName,
//       email: email,
//       password: password,
//       emailVerified: emailVerified,
//       dateOfBirth: dateOfBirth,
//       gender: gender,
//       phoneNumber: phoneNumber,
//       identificationProof: identificationProof,
//       profilePhoto: profilePhoto,
//       coverPhoto,
//       city,
//       state,
//       country: country,
//       interestedActivity: interestedActivity,
//       followers: followers,
//       following: following,
//       tripsCreated: tripsCreated,
//       isFavoriteItinerary: isFavoriteItinerary,
//       postsCreated: postsCreated,
//       userReviews: userReviews,
//       about,
//       bio,
//       views,
//     };

//     let savedUser;

//     // Check if the user ID is provided to determine if it's an update or creation
//     if (req.params.id) {
//       // If the user ID is provided, update the existing user
//       savedUser = await User.findByIdAndUpdate(req.params.id, userObject, {
//         new: true,
//         upsert: true,
//       });
//     } else {
//       // If no user ID is provided, create a new user
//       const userModel = new User(userObject);
//       savedUser = await userModel.save();
//     }
//     res.status(200).send(savedUser);
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .send('Unable to save or update user. Please try again later.');
//   }
// };

// // Function to find a user by username
// const getuserByUsername = async (req, res) => {
//   try {
//     // console.log(req.query);
//     const users = await User.find({
//       userName: { $regex: new RegExp(req.query.userName, 'i') },
//     });
//     return res.status(200).json(users);
//   } catch (error) {
//     throw new Error('Unable to find user by username: ' + error.message);
//   }
// };

// // Function to get a user by ID
// const getuserById = async (req, res) => {
//   try {
//     // console.log(req.params.id);
//     const id = req.params.id;

//     let user;
//     let trips = [];
//     let posts = [];

//     if (id) {
//       user = await User.findById(id).populate('userReviews.user').exec();

//       trips = await Itinerary.find({
//         createdBy: id,
//       }).sort('-createdAt');

//       posts = await Post.find({
//         user: id,
//       }).sort('-createdAt');
//     } else {
//       // console.log('session user: ', req.user);
//       user = await User.findById(req.user._id)
//         .populate('userReviews.user')
//         .exec();

//       trips = await Itinerary.find({
//         createdBy: req.user._id,
//       }).sort('-createdAt');

//       posts = await Post.find({
//         user: req.user._id,
//       }).sort('-createdAt');
//     }

//     // increase view count
//     user.views += 1;
//     await user.save();

//     // console.log('User: ', user);
//     // console.log('Trips: ', trips);
//     // console.log('Posts: ', posts);

//     user.postsCreated = posts;
//     user.tripsCreated = trips;

//     return res.status(200).json(user);
//   } catch (error) {
//     throw new Error('Unable to get user by ID: ' + error.message);
//   }
// };

// // Function to retrieve past trips of a user by their user ID
// const getPastTripsByUserId = async (userId) => {
//   try {
//     // Find the user by their ID
//     const user = await User.findById(userId);

//     if (!user) {
//       // Handle the case where the user is not found
//       return [];
//     }

//     // Filter trips that are in the past
//     const currentDate = new Date();
//     const pastTrips = user.tripsCreated.filter((trip) => {
//       return new Date(trip.startDate) < currentDate;
//     });

//     return pastTrips;
//   } catch (error) {
//     // Handle any errors
//     throw new Error('Unable to fetch past trips: ' + error.message);
//   }
// };

// // Function to retrieve posts by user ID
// const getPostsByUserId = async (userId) => {
//   try {
//     // Find the user by their ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return { error: 'User not found' };
//     }

//     // Get the user's posts by populating the "postsCreated" field
//     await user.populate('postsCreated').execPopulate();

//     const posts = user.postsCreated;

//     return posts;
//   } catch (error) {
//     return { error: 'Unable to fetch user posts' };
//   }
// };

// // Function to find a user by username
// const getUserByEmail = async (email) => {
//   try {
//     const user = await User.findOne({ email });
//     return user;
//   } catch (error) {
//     throw new Error('Unable to find user by username: ' + error.message);
//   }
// };

// // add the review
// const saveUserReview = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const { profileId } = req.params;
//     const { user: userId, review, userRating } = req.body;
//     const userFound = await User.findById(profileId);

//     // console.log(userFound);

//     const reviewedUser = await User.findById(userId);

//     userFound.userReviews = {
//       user: reviewedUser,
//       review,
//       userRating,
//     };

//     await userFound.save();

//     return res.status(200).json(userFound);
//   } catch (error) {
//     console.log(error);
//     throw new Error('Unable to find the user: ' + error.message);
//   }
// };

// const followUser = async (req, res) => {
//   const { userId } = req.params;
//   const { userToFollowId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const userToFollow = await User.findById(userToFollowId);

//     if (!user || !userToFollow) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.following.includes(userToFollowId)) {
//       user.following.push(userToFollowId);
//       userToFollow.followers.push(userId);

//       await user.save();
//       await userToFollow.save();

//       return res.status(200).json(userToFollow);
//     } else {
//       return res.status(400).json({ message: 'User is already followed' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const unfollowUser = async (req, res) => {
//   const { userId } = req.params;
//   const { userToUnfollowId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const userToUnfollow = await User.findById(userToUnfollowId);

//     if (!user || !userToUnfollow) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.following.includes(userToUnfollowId)) {
//       user.following = user.following.filter(
//         (id) => id.toString() !== userToUnfollowId
//       );
//       userToUnfollow.followers = userToUnfollow.followers.filter(
//         (id) => id.toString() !== userId
//       );

//       await user.save();
//       await userToUnfollow.save();

//       return res.status(200).json(userToUnfollow);
//     } else {
//       return res.status(400).json({ message: 'User is not followed' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   // savePreferences,
//   // saveFollowers,
//   saveUserReview,
//   // viewProfile,
//   saveoreditProfile,
//   getUserByEmail,
//   getuserByUsername,
//   getPastTripsByUserId,
//   getPostsByUserId,
//   getuserById,
//   followUser,
//   unfollowUser,
// };

const User = require("../models/user");
const Itinerary = require("../models/itinerary");
const mongoose = require("mongoose");
const Post = require("../models/post");
const { followNotification } = require("./notificationModule");

// Function to save or update user data
const saveoreditProfile = async (req, res) => {
  // console.log('Request body:', req.body);
  // console.log('Request files:', req.files);
  try {
    const {
      userName,
      email,
      password,
      emailVerified,
      dateOfBirth,
      gender,
      phoneNumber,
      identificationProof,
      profilePhoto,
      coverPhoto,
      city,
      state,
      country,
      interestedActivity,
      followers,
      following,
      tripsCreated,
      isFavoriteItinerary,
      postsCreated,
      userReviews,
      about,
      bio,
      views,
    } = req.body;

    const userObject = {
      userName: userName,
      email: email,
      password: password,
      emailVerified: emailVerified,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phoneNumber: phoneNumber,
      identificationProof: identificationProof,
      profilePhoto: profilePhoto,
      coverPhoto,
      city,
      state,
      country: country,
      interestedActivity: interestedActivity,
      followers: followers,
      following: following,
      tripsCreated: tripsCreated,
      isFavoriteItinerary: isFavoriteItinerary,
      postsCreated: postsCreated,
      userReviews: userReviews,
      about,
      bio,
      views,
    };

    let savedUser;

    // Check if the user ID is provided to determine if it's an update or creation
    if (req.params.id) {
      // If the user ID is provided, update the existing user
      savedUser = await User.findByIdAndUpdate(req.params.id, userObject, {
        new: true,
        upsert: true,
      });
    } else {
      // If no user ID is provided, create a new user
      const userModel = new User(userObject);
      savedUser = await userModel.save();
    }
    savedUser = await User.findById(savedUser._id).populate('userReviews.user');

    let trips = await Itinerary.find({
      createdBy: savedUser._id,
    }).sort('-createdAt');

    let posts = await Post.find({
      user: savedUser._id,
    }).sort('-createdAt');

    savedUser.postsCreated = posts;
    savedUser.tripsCreated = trips;
    
    res.status(200).send(savedUser);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Unable to save or update user. Please try again later.");
  }
};

// Function to find a user by username
const getuserByUsername = async (req, res) => {
  try {
    // console.log(req.query);
    const users = await User.find({
      userName: { $regex: new RegExp(req.query.userName, "i") },
    });
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
    // throw new Error("Unable to find user by username: " + error.message);
  }
};

// Function to get a user by ID
const getuserById = async (req, res) => {
  try {
    // console.log(req.params.id);
    const id = req.params.id;

    let user;
    let trips = [];
    let posts = [];

    if (id) {
      user = await User.findById(id).populate("userReviews.user").exec();

      trips = await Itinerary.find({
        createdBy: id,
      }).sort("-createdAt");

      posts = await Post.find({
        user: id,
      }).sort("-createdAt");
    } else {
      // console.log('session user: ', req.user);
      user = await User.findById(req.user._id)
        .populate("userReviews.user")
        .exec();

      trips = await Itinerary.find({
        createdBy: req.user._id,
      }).sort("-createdAt");

      posts = await Post.find({
        user: req.user._id,
      }).sort("-createdAt");
    }

    // increase view count
    user.views += 1;
    await user.save();

    // console.log('User: ', user);
    // console.log('Trips: ', trips);
    // console.log('Posts: ', posts);

    user.postsCreated = posts;
    user.tripsCreated = trips;

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Function to retrieve past trips of a user by their user ID
const getPastTripsByUserId = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      // Handle the case where the user is not found
      return [];
    }

    // Filter trips that are in the past
    const currentDate = new Date();
    const pastTrips = user.tripsCreated.filter((trip) => {
      return new Date(trip.startDate) < currentDate;
    });

    return pastTrips;
  } catch (error) {
    // Handle any errors
    res.status(500).json(error);

    // throw new Error("Unable to fetch past trips: " + error.message);
  }
};

// Function to retrieve posts by user ID
const getPostsByUserId = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return { error: "User not found" };
    }

    // Get the user's posts by populating the "postsCreated" field
    await user.populate("postsCreated").execPopulate();

    const posts = user.postsCreated;

    return posts;
  } catch (error) {
    return { error: "Unable to fetch user posts" };
  }
};

// Function to find a user by username
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    res.status(500).json(error);

    // throw new Error("Unable to find user by username: " + error.message);
  }
};

// add the review
// const saveUserReview = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const { profileId } = req.params;
//     const { user: userId, review, userRating } = req.body;
//     const userFound = await User.findById(profileId);

//     // console.log(userFound);

//     const reviewedUser = await User.findById(userId);

//     userFound.userReviews.push({
//       user: reviewedUser,
//       review,
//       userRating,
//     });

//     await userFound.save();

//     return res.status(200).json(userFound);
//   } catch (error) {
//     console.log(error);
//     throw new Error("Unable to find the user: " + error.message);
//   }
// };

// const followUser = async (req, res) => {
//   const { userId } = req.params;
//   const { userToFollowId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const userToFollow = await User.findById(userToFollowId);

//     if (!user || !userToFollow) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.following.includes(userToFollowId)) {
//       user.following.push(userToFollowId);
//       userToFollow.followers.push(userId);

//       let trips = await Itinerary.find({
//         createdBy: userToFollow._id,
//       }).sort('-createdAt');

//       let posts = await Post.find({
//         user: userToFollow._id,
//       }).sort('-createdAt');

//       userToFollow.postsCreated = posts;
//       userToFollow.tripsCreated = trips;

//       await user.save();
//       await userToFollow.save();

//       return res.status(200).json(userToFollow);
//     } else {
//       return res.status(400).json({ message: 'User is already followed' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const unfollowUser = async (req, res) => {
//   const { userId } = req.params;
//   const { userToUnfollowId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const userToUnfollow = await User.findById(userToUnfollowId);

//     if (!user || !userToUnfollow) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.following.includes(userToUnfollowId)) {
//       user.following = user.following.filter(
//         (id) => id.toString() !== userToUnfollowId
//       );
//       userToUnfollow.followers = userToUnfollow.followers.filter(
//         (id) => id.toString() !== userId
//       );

//       await user.save();
//       await userToUnfollow.save();

//       return res.status(200).json(userToUnfollow);
//     } else {
//       return res.status(400).json({ message: "User is not followed" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const saveUserReview = async (req, res) => {
  try {
    // console.log(req.body);
    const { profileId } = req.params;
    const { user: userId, review, userRating } = req.body;
    const userFound = await User.findById(profileId);

    // console.log(userFound);

    userFound.userReviews.push({
      user: userId,
      review,
      userRating,
    });

    await userFound.save();

    const userAfterReview = await User.findById(profileId).populate(
      "userReviews.user"
    );

    return res.status(200).json(userAfterReview);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);

    // throw new Error("Unable to find the user: " + error.message);
  }
};

const followUser = async (req, res) => {
  const { userId } = req.params;
  const { userToFollowId } = req.body;

  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId).populate(
      "userReviews.user"
    );

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.includes(userToFollowId)) {
      user.following.push(userToFollowId);
      userToFollow.followers.push(userId);

      let trips = await Itinerary.find({
        createdBy: userToFollow._id,
      }).sort("-createdAt");

      let posts = await Post.find({
        user: userToFollow._id,
      }).sort("-createdAt");

      userToFollow.postsCreated = posts;
      userToFollow.tripsCreated = trips;

      await user.save();
      await userToFollow.save();

      await followNotification(userId, userToFollowId, "FOLLOW");

      return res.status(200).json(userToFollow);
    } else {
      return res.status(400).json({ message: "User is already followed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const { userToUnfollowId } = req.body;

  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId).populate(
      "userReviews.user"
    );

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(userToUnfollowId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== userToUnfollowId
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== userId
      );

      let trips = await Itinerary.find({
        createdBy: userToUnfollow._id,
      }).sort("-createdAt");

      let posts = await Post.find({
        user: userToUnfollow._id,
      }).sort("-createdAt");

      userToUnfollow.postsCreated = posts;
      userToUnfollow.tripsCreated = trips;

      await user.save();
      await userToUnfollow.save();

      return res.status(200).json(userToUnfollow);
    } else {
      return res.status(400).json({ message: "User is not followed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  // savePreferences,
  // saveFollowers,
  saveUserReview,
  // viewProfile,
  saveoreditProfile,
  getUserByEmail,
  getuserByUsername,
  getPastTripsByUserId,
  getPostsByUserId,
  getuserById,
  followUser,
  unfollowUser,
};
