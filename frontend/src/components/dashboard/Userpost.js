import React from "react";
import person1 from "./person1.jpeg";
import person2 from "./person2.jpeg";
import "./Userpost.css";
import "./Travelfeed.css";
const UserPost = () => {
  // Static data
  const userData = {
    userName: "Miranda Shaffer",
    location: "California, California, USA",
    fromDate: "Apr 20, 2023",
    toDate: "Apr 27, 2023",
    agePref: "25-30",
    genderPref: "Any",
    budget: "$1000 - $2000",
    profileImage: person1,
    postContent:
      "Wanting to explore the main attractions of LA and New York and see what it’s known for. Would also love to do activities (walks, hikes) and find the best cafes.",
  };
  const postImages = [person1, person2];

  return (
    <div className="user-post">
      <div className="user-info">
        <img
          src={userData.profileImage}
          alt={`${userData.userName}'s profile`}
          className="profile-image"
        />
        <div>
          <h3>{userData.userName}</h3>
          <p>
            <span role="img" aria-label="location">
              📍
            </span>{" "}
            {userData.location}
          </p>
          <p>
            📅 {userData.fromDate} - {userData.toDate}
          </p>
        </div>
      </div>
      <div className="user-preferences">
        <p>Age Preference: {userData.agePref}</p>
        <p>Gender Preference: {userData.genderPref}</p>
        <p>Budget: {userData.budget}</p>
      </div>
      <div className="post-content">
        <p>{userData.postContent}</p>
      </div>
      <div className="post-images">
        {postImages.map((imgSrc, index) => (
          <img key={index} src={imgSrc} alt={`Post image ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default UserPost;
