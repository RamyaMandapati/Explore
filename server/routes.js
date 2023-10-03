const express = require("express");
const passport = require("passport");
const router = express.Router();
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

// itinerary related routes
router.post("/itinerary", addItinerary);
router.get("/itinerary/:id", getItineraryById);
router.get("/itinerary", getItineraries);
router.get("/itinerary/user/:id", getItineraryByUserId);
router.put("/itinerary/members", itineraryMembers);
router.put("/itinerary/requestmember", itineraryAccessRequest);
router.put("/itinerary/like", itineraryLikeCount);
router.put("/itinerary/dislike", removeItineraryLikeCount);
router.put("/itinerary/rating", itineraryRating);

router.put("/users/favitinerary", favoriteItinerary);
router.put("/users/delfavitinerary", deletefavoriteItinerary);

//notification related routes
router.put("/notification", readNotification);
router.delete("/notification/:id", deleteNotification);
router.get("/notification/:id", getNotifications);

module.exports = router;
