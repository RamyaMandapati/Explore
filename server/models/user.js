const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String },
  identificationProof: { type: String },
  profilePhoto: { type: String },
  coverPhoto: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  age: { type: String },
  interestedActivity: [
    {
      type: String,
    },
  ],
  about: {
    type: String,
  },
  bio: {
    type: String,
  },

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  tripsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'itinerary',
    },
  ],
  isFavoriteItinerary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'itinerary',
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  postsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
  userReviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('user', userProfileSchema);
