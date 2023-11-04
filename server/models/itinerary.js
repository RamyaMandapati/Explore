const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  itineraryName: { type: String },
  destination: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number },
  imageUrl: { type: String },
  itineraryList: [
    {
      day: { type: Number },
      places: [
        {
          placeName: { type: String },
          lat: { type: Number },
          lng: { type: Number },
          placeImage: { type: String },
          startTime: { type: String },
          endTime: { type: String },
          description: { type: String },
          category: { type: String },
          cost: { type: Number },
        },
      ],
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  nonmembers: [
    {
      type: String,
    },
  ],
  requestedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  itineraryRating: {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    totalcount: { type: Number, default: 0 },
    totalrating: { type: Number, default: 0 },
  },
  itineraryAvgRating: {
    type: Number,
    default: 0.0,
  },
  likes: {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    likecount: { type: Number, default: 0 },
  },
  interests: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdTimestamp: { type: Date, default: Date.now },
  updatedTimestamp: { type: Date, default: Date.now },
  tags: [{ type: String }],
});

// itinerarySchema.pre(/^find/, function () {
//   this.populate("members", "-role").populate("createdBy");
// });

module.exports = mongoose.model("itinerary", itinerarySchema);
