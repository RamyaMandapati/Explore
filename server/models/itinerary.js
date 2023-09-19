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
      Day: { type: String },
      Places: [
        {
          placeId: { type: Number },
          placeName: { type: String },
          Latitude: { type: Number },
          Longitude: { type: Number },
          placeImage: { type: String },
          startTime: { type: Date },
          endTime: { type: Date },
          Description: { type: String },
          Category: { type: String },
          Cost: { type: Number },
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
  itineraryRating: { type: Number, default: 0.0 },
  likeCount: { type: Number, default: 0 },
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
