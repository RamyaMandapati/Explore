const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  addItinerary,
  getItineraryById,
  getItineraries,
} = require("./modules/itineraryModule");

router.post("/itinerary", addItinerary);
router.get("/itinerary/:id", getItineraryById);
router.get("/itinerary", getItineraries);
getItineraries;

module.exports = router;
