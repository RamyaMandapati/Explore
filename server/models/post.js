const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model for the post's author
    required:true,
  },
  tripCountry: { type: String },
  tripState: { type: String },
  locationName: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  imageUrls: [
    {
      type: String,
    },
  ],
  title: { type: String },
  description: { type: String },
  itineraryID: { type: Number },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to users who liked the post
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to the user who made the comment
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  genderPref: { type: String },
  minAge: { type: Number },
  maxAge: { type: Number },
});

module.exports = mongoose.model("post", postSchema);
