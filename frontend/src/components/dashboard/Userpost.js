import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Userpost.css';
import profilephoto from '../../images/profilephoto.png'
const UserPost = ({ genderFilter, ageFilter, countryFilter }) => {
  const [posts, setPosts] = useState([]);
 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  useEffect(() => {
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
  }, []);

  const filteredPosts = posts.filter(post => {
    // Apply gender, age, and country filters
    // You'll need to adjust the logic based on how the age filter is supposed to work
    return (genderFilter ? post.genderPref === genderFilter : true) &&
           (ageFilter ? post.minAge===ageFilter : true) &&
           (countryFilter ? post.location.includes(countryFilter) : true);
  });

  return (
    
      <div className="main-content">
      {filteredPosts.map((post, index) => (

        <div key={index} className="user-post">
          <div className="user-info">
            <img
              src={post.user?.profilePhoto || profilephoto}
              
              className="profile-image"
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
          
       
        </div>
      
      ))}
    </div>
    // </div>
  );
};

export default UserPost;
