const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  identificationProof: { type: String },
  profilePhoto: { type: String },

  address: {
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
  },

  country: { type: String, required: true },
  interestedActivity: [
    {
      type: String,
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  tripsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itinerary",
    },
  ],
  isFavoriteItinerary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itinerary",
    },
  ],
  postsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  userReviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      review: {
        type: String,
      },
      userRating: { type: Number, default: 0.0 },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("user", userProfileSchema);
