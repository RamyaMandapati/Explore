const Post = require("../models/Post.js"); // Assuming you have a Post model

// Create a new post
const addPost = async (req, res) => {
  try {
    const { title, description, user, genderPref, tripCountry, imageUrls, tripState, locationName, fromDate, toDate, iteneraryId, tags, minAge, maxAge} = req.body;
    const newPost = new Post({
      title,
      description,
      user,
      genderPref,
      tripCountry,
      imageUrls,
      tripState,
      locationName,
      fromDate,
      toDate, 
      iteneraryId, 
      tags, 
      minAge, 
      maxAge
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating a post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Filter posts based on criteria (e.g., trip type or status)
const filterPosts = async (req, res) => {
  try {
    const { tripType, tripStatus } = req.query;
    const filter = {};
    if (tripType) {
      filter.tripType = tripType;
    }
    if (tripStatus) {
      filter.tripStatus = tripStatus;
    }

    const filteredPosts = await Post.find(filter);
    res.json(filteredPosts);
  } catch (error) {
    console.error("Error filtering posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addPost,
  getPosts,
  filterPosts,
};
