const Post = require("../models/post.js"); // Assuming you have a Post model
const multer = require("multer");
const upload = multer();
// Create a new post
const addPost = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      title,
      description,
      user,
      genderPref,
      tripCountry,
      imageUrls,
      tripState,
      location,
      fromDate,
      toDate,
      itineraryId,
      tags,
      minAge,
      maxAge,
      budget,
    } = req.body;
    const newPost = new Post({
      title,
      description,
      user,
      genderPref,
      tripCountry,
      imageUrls,
      tripState,
      location,
      fromDate,
      toDate,
      itineraryId,
      tags,
      minAge,
      maxAge,
      budget,
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
    const posts = await Post.find().populate('user').populate({
      path: 'comments.user',
 // Only include the userName field
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const delPost= async(req,res)=>{
  try{
    const postId=req.params.postId;
    const deletedPost=await Post.findByIdAndDelete(postId);
    res.status(200).json(deletedPost);
  }catch(error){
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
//app.post('/likePost/:postId', async (req, res) => {
const updateLikes = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId; // Assuming the user's ID is sent in the request body

  try {
    // Find the post by ID and update it
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).send("User already liked this post");
    }

    // Add the user's ID to the likes array
    post.likes.push(userId);

    // Save the updated post
    await post.save();

    res.status(200).send("Post liked successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

//app.post('/addComment/:postId', async (req, res) => {
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body; // userId is the ID of the user making the comment

  if (!text) {
    return res.status(400).send("Comment text is required");
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Create a new comment object
    const newComment = {
      user: userId,
      text: text,
      createdAt: new Date(), // Timestamp for the comment
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Comment added successfully", post });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
  addPost,
  getPosts,
  filterPosts,
  updateLikes,
  addComment,
  delPost,
};
