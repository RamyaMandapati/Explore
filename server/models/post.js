const Post = require("../models/post");

// Create a new post
const addPost = async (req, res) => {
  try {
    const {
      user,
      tripCountry,
      tripState,
      locationName,
      fromDate,
      toDate,
      imageUrls,
      Title,
      Description,
      itineraryID,
      tags,
      genderPref,
      minAge,
      maxAge,
    } = req.body;

    const newPost = new Post({
      user,
      tripCountry,
      tripState,
      locationName,
      fromDate,
      toDate,
      imageUrls,
      Title,
      Description,
      itineraryID,
      tags,
      genderPref,
      minAge,
      maxAge,
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
    const { tripCountry, tripState, tags } = req.query;
    const filter = {};

    if (tripCountry) {
      filter.tripCountry = tripCountry;
    }
    if (tripState) {
      filter.tripState = tripState;
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") }; // Convert comma-separated tags to an array
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
