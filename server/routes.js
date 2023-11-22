const express = require("express");
const passport = require("passport");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {
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
} = require("./modules/itineraryModule");

const {
  readNotification,
  deleteNotification,
  getNotifications,
} = require("./modules/notificationModule");
const { addPost, getPosts, filterPosts, updateLikes,addComment } = require("./modules/postModule");
const {
  updateUserPreference,
  findUserByEmail,
  updateFollowers,
  savePost,
} = require("./modules/userModule");

const { editMember } = require("./modules/groupModule");


// itinerary related routes
router.post("/itinerary", addItinerary);
router.get("/itinerary/:id", isLoggedIn, getItineraryById);
router.get("/itinerary", getItineraries);
router.get("/itinerary/user/:id", getItineraryByUserId);
router.put("/itinerary/members", itineraryMembers);
router.put("/itinerary/requestmember", itineraryAccessRequest);
router.put("/itinerary/like", itineraryLikeCount);
router.put("/itinerary/dislike", removeItineraryLikeCount);
router.put("/itinerary/rating", itineraryRating);
router.post("/follow/:userIdToFollow", updateFollowers);
router.put("/users/favitinerary", favoriteItinerary);
router.put("/users/delfavitinerary", deletefavoriteItinerary);
router.post("/savePost/:postId", savePost);
//notification related routes
router.put("/notification", readNotification);
router.delete("/notification/:id", deleteNotification);
router.get("/notification/:id", getNotifications);

//Post routes
router.post("/addPost", upload.any(), addPost);
router.get("/getPosts", getPosts);
router.get("/filterPosts", filterPosts);
router.post("/likePost/:postId", updateLikes);
//user Router
router.put("/pref", updateUserPreference);
router.post("/user/email", findUserByEmail);




//groupRouter
router.post("/group/editmember", editMember);
router.post("/addComment/:postId", addComment);
router.get("/session", isLoggedIn, async (req, res, next) => {
  if (req.user) {
    const { user } = req;
    res.json({
      success: true,
      isAuthenticated: true,
      user: user,
    });
  } else {
    res.status(401).json({ message: "Not authorized", success: false });
  }
});

async function isLoggedIn(req, res, next) {
  const { dc_token } = req.cookies;

  req.headers.authorization = `Bearer ${dc_token}`;
  return passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (process.env.NODE_ENV === "test") {
      // for testing only
      return next();
    }
    console.log(user);
    if (user && user.id) {
      req.user = user;
      return next();
    }
    res.status(401).json({
      message: "Not authorized to see this page. Please login!",
      status: 401,
    });
  })(req, res, next);
}

module.exports = router;
