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
} = require("./modules/itineraryModule");

router.post("/itinerary", addItinerary);
router.get("/itinerary/:id", getItineraryById);
router.get("/itinerary", getItineraries);
router.get("/itinerary/user/:id", getItineraryByUserId);
router.put("/itinerary/members", itineraryMembers);
router.put("/users/favitinerary", favoriteItinerary);
router.put("/users/delfavitinerary", deletefavoriteItinerary);
module.exports = router;
