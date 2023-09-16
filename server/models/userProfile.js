const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    identificationProof: { type: String },
    profilePhoto: { type: String, required: true },

    address: [
        {
          addressDetails: [
            {
                addressLine: { type: String, required: true },
                city: { type: String, required: true  },
                state: { type: String, required: true },
                zipCode: { type: Number,  required: true},
            },
          ]
        }
    ],

    country : { type: String, required: true },
    interestedActivity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      }],
    tripsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      }],
    postsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      }],
    userReviews: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', 
          required: true,
        },
        review: {
          type: String,
          required: true,
        },
        userRating: { type: Number, default: 0.0 },
        createdAt: {
          type: Date,
          default: Date.now,
        }
}],    


});

module.exports = mongoose.model('userProfile', userProfileSchema);
