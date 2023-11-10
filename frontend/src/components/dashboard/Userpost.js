import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Userpost.css';

const UserPost = ({ genderFilter, ageFilter, countryFilter }) => {
  const [posts, setPosts] = useState([]);
 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/getPosts');
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
              src={post.user.profilePhoto}
              alt={`${post.user.userName}'s profile`}
              className="profile-image"
            />
            <div>
              <h3>{post.user.userName}</h3>
              <p>
                <span role="img" aria-label="location">
                  📍
                </span>{" "}
                {post.location}
              </p>
              <p>
                📅 {post.fromDate} - {post.toDate}
              </p>
            </div>
          </div>
          <div className="user-preferences">
            <p>Age Preference: {post.minAge}-{post.maxAge}</p>
            <p>Gender Preference: {post.genderPref}</p>
            <p>Budget: {post.budget}</p>
          </div>
          <div className="post-content">
            <p>{post.description}</p>
          </div>
          <div className="post-images">
            {post.imageUrls.map((imgSrc, imgIndex) => (
              <img key={imgIndex} src={imgSrc} alt={`Post image ${imgIndex}`} />
            ))}
          </div>
        </div>
      
      ))}
    </div>
    // </div>
  );
};

export default UserPost;
