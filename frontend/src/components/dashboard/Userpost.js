import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Userpost.css';
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
import profilephoto from '../../images/profilephoto.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faUserPlus, faUserFriends, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
const UserPost = ({ genderFilter, ageFilter, budgetFilter }) => {
  const [posts, setPosts] = useState([]);
  const [showCommentsForPost, setShowCommentsForPost] = useState(null);
  const [newComment, setNewComment] = useState({});
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [min, max] = ageFilter.split('-').map(Number);
  const { user } = useSelector((state) => state.auth);
  console.log(user._id);
  const history = useHistory();

  const navigateToNewPost = () => {
    history.push('/newPost');
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/getPosts');
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [dispatch, user]);
  const handleFollow = async (userIdToFollow) => {
    // Assuming `currentUserId` is available through the user's session or authentication context
    const currentUserId = user._id; // Replace with actual logic to retrieve current user ID
    try {
      const response = await axios.post(`http://localhost:4000/api/follow/${userIdToFollow}`,{currentUserId});
      console.log(response.data); // Handle the response appropriately
      // You might want to update the state to reflect the new follow relationship
    } catch (error) {
      console.error('Error following user:', error);
      // Handle errors, such as displaying a message to the user
    }
  };
  const parseBudgetFilter = (filter) => {
    if (!filter) return { min: 0, max: Infinity };
    if (filter === "5000+") return { min: 5000, max: Infinity };
    const max = parseInt(filter.slice(1), 10);
    return { min: 0, max };
  };
  const { budgetmin, budgetmax } = parseBudgetFilter(budgetFilter);
  const filteredPosts = posts.filter(post => {
    // Apply gender, age, and country filters
    // You'll need to adjust the logic based on how the age filter is supposed to work
    
    return (genderFilter ? post.genderPref === genderFilter : true) &&
           (ageFilter ? (post.minAge>=min) && (post.maxAge<=max) : true) &&
           
           (budgetFilter? (post.budget >= budgetmin) && (post.budget <= budgetmax) : true)&&
           (searchTerm ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.description.toLowerCase().includes(searchTerm.toLowerCase()) : true);
  });
  const handleCommentClick = (index) => {
    setShowCommentsForPost(showCommentsForPost === index ? null : index);
  };
  const handleLike = async (postId) => {
    const userId = user._id; // The current user's ID
    try {
      const response = await axios.post(`http://localhost:4000/api/likePost/${postId}`, { userId });
      console.log(response.data);
  
      // Update the state to reflect the new like
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return { ...post, likes: [...post.likes, userId] };
        }
        return post;
      });
  
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  

  const handleCommentChange = (text, index) => {
    setNewComment({ ...newComment, [index]: text });
  };
  const submitComment = async (index, commentText) => {
    const postId = posts[index]._id; // ID of the post being commented on
    const userId = user._id; // The current user's ID
  
    if (!commentText.trim()) {
      return; // Avoid sending empty comments
    }
  
    try {
      const response = await axios.post(`http://localhost:4000/api/addComment/${postId}`, {
        userId,
        text: commentText
      });
  
      console.log(response.data);
  
      // Update the state to include the new comment
      const updatedPosts = [...posts];
      updatedPosts[index].comments.push({ user, text: commentText, createdAt: new Date() });
  
      setPosts(updatedPosts);
      setNewComment({ ...newComment, [index]: '' }); // Clear the comment input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
  <button className="create-post-btn" onClick={navigateToNewPost}>+ Create Post</button>
  <button className="create-itinerary-btn">+ Create Itinerary</button>
</div>

      </div> 
      {filteredPosts.map((post, index) => (

        <div key={index} className="user-post">
          <div className="top-right-icons">
            <FontAwesomeIcon icon={faUserPlus} className="icon follow-icon" style={{marginRight:"20px"}}  onClick={() => handleFollow(post.user?._id)} />
            {/* <FontAwesomeIcon icon={faUserFriends} className="icon connect-icon" /> */}
          </div>

          <div className="user-info">
            <img
              src={post.user?.profilePhoto || profilephoto}
              
              className="profile-image-user"
            />
            <div>
              <h3>{post.user?.userName || "username"}</h3>
        
            </div>
          </div>
          <p style={{marginTop:"10px"}}>
                <span role="img" aria-label="location">
                  📍
                </span>
                {post.location}
              </p>
          <div className="post-images-container">
  {/* Large featured image */}
  {post.imageUrls.length > 0 && (
    <img src={post.imageUrls[0]} alt="Featured" className="featured-image" />
  )}

  {/* Grid for the smaller images */}
  <div className="grid-images">
    {post.imageUrls.slice(1, 5).map((imgSrc, imgIndex) => (
      <img key={imgIndex} src={imgSrc} alt={`Post image ${imgIndex + 1}`} className="grid-image" />
    ))}

    {/* Overlay image with the count, if more images are present */}
    {post.imageUrls.length > 5 && (
      <div className="overlay-container">
        <img src={post.imageUrls[5]} alt="More images" className="grid-image overlay-image" />
        <span className="overlay-text">+{post.imageUrls.length - 5}</span>
      </div>
    )}
  </div>
</div>

          <div className="user-preferences">
              <div className="post-content">
            <p>{post.description}</p>
          </div>
              <p>
                📅 {formatDate(post.fromDate)} - {formatDate(post.toDate)}
              </p>
            <p>Age Preference: {post.minAge}-{post.maxAge}</p>
            <p>Gender Preference: {post.genderPref || 'None'}</p>
            <p>Budget: {post.budget}$</p>
          </div>
          <div className="post-interactions">
            <span className="likes">
              
              {post.likes.length} likes{/* Replace with the actual like count */}
            </span>
            <span className="comments">
              
              {post.comments.length} comments {/* Replace with the actual comment count */}
            </span>
          </div>
          <div className="bottom-right-icons">
            <FontAwesomeIcon icon={faThumbsUp} className="icon like-icon" onClick={() => handleLike(post._id)}/>
            <FontAwesomeIcon icon={faComment} className="icon comment-icon" onClick={() => handleCommentClick(index)}/>
          </div>
         
          {showCommentsForPost === index && (
            
            <div className="comment-input-section">
              <hr></hr>
              <input
                type="text"
                className="comment-input"
                placeholder="Write a comment..."
                value={newComment[index] || ''}
                onChange={(e) => handleCommentChange(e.target.value, index)}
                onKeyPress={(e) => e.key === 'Enter' ? submitComment(index, newComment[index]) : null}
              />
              <FontAwesomeIcon
  icon={faPaperPlane}
  className="comment-submit-arrow"
  onClick={() => submitComment(index, newComment[index])}
/>

            </div>
          )}
              {/* Existing comments */}
              {post.comments.map((comment, commentIndex) => (
  <div key={commentIndex} className="comment">
    <strong>{comment.user.userName || "Anonymous"}: </strong>{comment.text}
    {/* You can format and display the timestamp as well */}
  </div>
))}
           
            </div>
        
       
        
      
      ))}
    </div>
    
  );
};

export default UserPost;
