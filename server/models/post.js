const post = new Schema({
    user: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User', // Reference to the User model for the post's author
 required: true,
},
    tripCountry: {type: String},
    tripState: {type: String},
    locationName: {type: String},
    fromDate:  {type: Date},
    toDate:  {type: Date},
    imageUrls: [{
    type: String,  }],
    Title: {type: String},
    Description: {type: String},
    itineraryID: {type: Integer},
    likes: [{
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User', // Reference to users who liked the post
}],
comments: [{
 user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User', // Reference to the user who made the comment
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
}],    
tags: [{type: String},],
createdAt: {
 type: Date,
 default: Date.now,
},
genderPref: {type: String},
minAge : {type: Integer},
maxAge: {type: Integer},
});

module.exports = mongoose.model('Post', postSchema);