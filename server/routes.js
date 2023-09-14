const express = require("express");
const passport = require("passport");
const router = express.Router();
const { addItinerary } = require("./modules/itineraryModule");

router.post("/itinerary", addItinerary);

module.exports = router;
