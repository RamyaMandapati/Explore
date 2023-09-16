
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const myPostsSchema = new Schema({
    userId: { type: String, required: true },
    typeOfTrip: { type: String, required: true },
    visibility: { type: String },
    itinerary: [{
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itinerary', 
        required: true,
      }],    

    Posts: [{
        
          type: mongoose.Schema.Types.ObjectId,
          ref: 'post', 
          required: true,
        }]    
});

module.exports = mongoose.model('myPosts', myPostsSchema);
