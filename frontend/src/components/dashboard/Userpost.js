import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Userpost.css";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
import profilephoto from "../../images/profilephoto.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  faThumbsUp,
  faComment,
  faUserPlus,
  faUserFriends,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
const UserPost = ({ genderFilter, ageFilter, budgetFilter }) => {
  const [posts, setPosts] = useState([]);
  const [showCommentsForPost, setShowCommentsForPost] = useState(null);
  const [newComment, setNewComment] = useState({});
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [min, max] = ageFilter.split("-").map(Number);
  const [minStr, maxStr] = budgetFilter.split("-").map(Number);
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(null);
  console.log(user._id);
  const history = useHistory();
  const toggleMenu = (index) => {
    if (showMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // API call to delete the post
      const response = await axios.delete(
        `http://localhost:4000/api/deletePost/${postId}`,
        {
          data: { userId: user._id },
        }
      );
      // Handle the successful deletion here
      console.log(response.data.message);
      // Optionally, update the posts state to reflect the deletion
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      // Handle the error here
      console.error(
        "Error deleting post:",
        error.response?.data?.message || error.message
      );
    }
  };
  const handleSavePost = async (postId) => {
    setShowMenu(null);
    const currentUserId = user._id; // Replace with actual logic to retrieve current user ID
    try {
      const response = await axios.post(
        `http://localhost:4000/api/savePost/${postId}`,
        { currentUserId }
      );
      console.log(response.data); // Handle the response appropriately
      // You might want to update the state to reflect the new follow relationship
    } catch (error) {
      console.error("Error saving post", error);
      // Handle errors, such as displaying a message to the user
    }
  };

  const navigateToNewPost = () => {
    history.push("/newPost");
  };

  const navigateToNewItinerary = () => {
    history.push("/plan");
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/getPosts");
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [dispatch, user]);
  const handleFollow = async (userIdToFollow) => {
    // Assuming `currentUserId` is available through the user's session or authentication context
    const currentUserId = user._id; // Replace with actual logic to retrieve current user ID
    try {
      const response = await axios.post(
        `http://localhost:4000/api/follow/${userIdToFollow}`,
        { currentUserId }
      );
      toast.success("Followed successfully!");
      console.log(response.data); // Handle the response appropriately
      // You might want to update the state to reflect the new follow relationship
    } catch (error) {
      toast.error("Error following user.");
      console.error("Error following user:", error);
      // Handle errors, such as displaying a message to the user
    }
    window.location.reload();
  };
  const parseBudgetFilter = (filter) => {
    if (!filter) return { min: 0, max: Infinity };
    console.log(filter);
    if (filter === "5000+") return { min: 5000, max: Infinity };
    const [minStr, maxStr] = filter.split("-").map(Number);
   
    return { min: Number(minStr), max: Number(maxStr) };
  };
  
  
  const filteredPosts = posts.filter((post) => {
    
    // Apply gender, age, and country filters
    // You'll need to adjust the logic based on how the age filter is supposed to work
    

    const postBudget = Number(post.budget);
    console.log(postBudget);
    
    return (
      (genderFilter ? post.genderPref === genderFilter : true) &&
      (ageFilter ? post.minAge >= min && post.maxAge <= max : true) &&
      (budgetFilter ? postBudget >= minStr && postBudget <= maxStr : true) &&
      (searchTerm
        ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  });
  const handleCommentClick = (postId) => {
    setShowCommentsForPost(showCommentsForPost === postId ? null : postId);
  };
  const handleLike = async (postId) => {
    const userId = user._id; // The current user's ID
    try {
      const response = await axios.post(
        `http://localhost:4000/api/likePost/${postId}`,
        { userId }
      );
      console.log(response.data);

      // Update the state to reflect the new like
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: [...post.likes, userId] };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentChange = (text, postId) => {
    setNewComment({ ...newComment, [postId]: text });
  };
  const submitComment = async (postId, commentText) => {
    if (!commentText.trim()) {
      return; // Avoid sending empty comments
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/addComment/${postId}`,
        {
          userId: user._id,
          text: commentText,
        }
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                { user, text: commentText, createdAt: new Date() },
              ],
            };
          }
          return post;
        })
      );
      setNewComment({ ...newComment, [postId]: "" }); // Clear the comment input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const navigateToItineraryPlan = () => {
    history.push(`/plan`);
  };
  return (
    <div className="main-content">
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="button-container">
          <button className="create-post-btn" onClick={navigateToNewPost}>
            Create Post
          </button>
          <button
            className="create-itinerary-btn"
            onClick={navigateToNewItinerary}
          >
            Create Itinerary
          </button>
        </div>
      </div>
      {filteredPosts
        ?.slice()
        .reverse()
        .map((post, index) => (
          <div key={post._id} className="user-post">
            <div className="top-right-icons">
            <ToastContainer /> 
            {user._id !== post.user?._id && !user.following.includes(post.user?._id) && (
              <FontAwesomeIcon
                icon={faUserPlus}
                className={`icon follow-icon ${
                  user.following.includes(post.user?._id) ? "followed" : ""
                }`}
                onClick={() => handleFollow(post.user?._id)}
                style={{ marginRight: "10px" }}
              />
              )}
              <FontAwesomeIcon
                icon={faEllipsisV}
                onClick={() => toggleMenu(index)}
              />
              {showMenu === index && (
                <div className="post-menu">
                  <div onClick={() => handleSavePost(post._id)}>Save Post</div>
                  {user._id === post.user?._id && (
                  <div onClick={() => handleDeletePost(post._id)}>
                    Delete Post
                  </div>
                  )}
                </div>
              )}
            </div>

            <div className="user-info">
              <img
                src={post.user?.profilePhoto || profilephoto}
                className="profile-image-user"
              />
              <div>
                <h2
                  className="userPostName"
                  style={{ fontSize: "16px" }}
                  onClick={() => history.push(`/profile/${post.user?._id}`)}
                >
                  {post.user?.userName || "username"}
                </h2>
              </div>
            </div>
            <p style={{ marginTop: "10px", marginBottom: "10px" }}>
              <span role="img" aria-label="location">
                📍
              </span>
              {post.location}
            </p>
            <div className="post-images-container">
              {/* Large featured image */}
              {post.imageUrls.length > 0 && (
                <img
                  src={post.imageUrls[0]}
                  alt="Featured"
                  className="featured-image"
                />
              )}

              {/* Grid for the smaller images */}
              <div className="grid-images">
                {post.imageUrls.slice(1, 5).map((imgSrc, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={imgSrc}
                    alt={`Post image ${imgIndex + 1}`}
                    className="grid-image"
                  />
                ))}

                {/* Overlay image with the count, if more images are present */}
                {post.imageUrls.length > 5 && (
                  <div className="overlay-container">
                    <img
                      src={post.imageUrls[5]}
                      alt="More images"
                      className="grid-image overlay-image"
                    />
                    <span className="overlay-text">
                      +{post.imageUrls.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {post.itineraryId && (
              <button
                className="view-itinerary-btn"
                onClick={() =>
                  (window.location.href = `/itinerary/${post.itineraryId}`)
                }
              >
                View Itinerary
              </button>
            )}
            <div className="user-preferences">
              <div className="post-content">
                <p>{post.description}</p>
              </div>
              <p>
                📅 {formatDate(post.fromDate)} - {formatDate(post.toDate)}
              </p>
              <p>
                Age Preference: {post.minAge}-{post.maxAge}
              </p>
              <p>Gender Preference: {post.genderPref || "None"}</p>
              <p>Budget: {post.budget}$</p>
            </div>
            <div className="post-interactions">
              <span className="likes">
                {post.likes.length} likes
                {/* Replace with the actual like count */}
              </span>
              <span className="comments">
                {post.comments.length} comments{" "}
                {/* Replace with the actual comment count */}
              </span>
            </div>
            <div className="bottom-right-icons">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className={`icon like-icon ${
                  post.likes.includes(user._id) ? "liked" : ""
                }`}
                onClick={() => handleLike(post._id)}
              />
              <FontAwesomeIcon
                icon={faComment}
                className="icon comment-icon"
                onClick={() => handleCommentClick(index)}
              />
            </div>

            {showCommentsForPost === index && (
              <div className="comment-input-section">
                <hr></hr>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Write a comment..."
                  value={newComment[post._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(e.target.value, post._id)
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter"
                      ? submitComment(post._id, newComment[post._id])
                      : null
                  }
                />
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="comment-submit-arrow"
                  onClick={() => submitComment(post._id, newComment[post._id])}
                />
              </div>
            )}
            {/* Existing comments */}
            {post.comments.map((comment, commentIndex) => (
              <div key={commentIndex} className="comment">
                <strong>{comment.user.userName || "Anonymous"}: </strong>
                {comment.text}
                {/* You can format and display the timestamp as well */}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default UserPost;
