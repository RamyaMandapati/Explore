import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Userpost.css';

import './Filters.css';
const UserPost = () => {
  const [posts, setPosts] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

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

  // const applyFilters = () => {
  //   return posts.filter(post => {
  //     const matchesGender = genderFilter ? post.genderPref.toLowerCase() === genderFilter.toLowerCase() : true;
  //     const age = parseInt(ageFilter, 10);
  //     const matchesAge = ageFilter ? age >= post.minAge && age <= post.maxAge : true;
  //     const matchesCountry = countryFilter ? post.location.toLowerCase().includes(countryFilter.toLowerCase()) : true;
      
  //     return matchesGender && matchesAge && matchesCountry;
  //   });
  // };

  // const filteredPosts = applyFilters();

  return (
    // <div className="layout">
    //   <div className="sidebar">
    //     <div className="filters">
    //       <label style={{ marginBottom: "20px" }}>Filters</label>
    //       <div className="filter-item">
    //         <label>Gender:</label>
    //         <input
    //           type="text"
    //           value={genderFilter}
    //           onChange={(e) => setGenderFilter(e.target.value)}
    //           placeholder="Gender filter..."
    //         />
    //       </div>
    //       <div className="filter-item">
    //         <label>Age:</label>
    //         <input
    //           type="text"
    //           value={ageFilter}
    //           onChange={(e) => setAgeFilter(e.target.value)}
    //           placeholder="Age filter..."
    //         />
    //       </div>
         
    //       <div className="filter-item">
    //         <label>Country:</label>
    //         <input
    //           type="text"
    //           value={countryFilter}
    //           onChange={(e) => setCountryFilter(e.target.value)}
    //           placeholder="Country filter..."
    //         />
    //       </div>
    //     </div>
    //   </div>
      <div className="main-content">
      {posts.map((post, index) => (
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
