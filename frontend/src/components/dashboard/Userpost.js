import React from "react";
import person1 from "./person1.jpeg";
import person2 from "./person2.jpeg";
import "./Userpost.css";
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

// import "./Travelfeed.css";
// function UserPost() {
//   return (
//     <div className="user-post">
//       <div className="post-header">
//         <img
//           src="path_to_user_image"
//           alt="Miranda Shaffer"
//           className="profile-pic"
//         />
//         <div className="post-details">
//           <span className="username">Miranda Shaffer</span>
//           <span className="post-date">June 21, 12:45 pm</span>
//           <span className="location">California, California, USA</span>
//           <span className="travel-date">Apr 20, 2023 - Apr 27, 2023</span>
//           <p className="post-description">
//             Wanting to explore the main attractions of LA and New York and see
//             what it's known for. Would also love to do activities (walks, hikes)
//             and find the best cafes.
//           </p>
//         </div>
//       </div>
//       <div className="post-images">
//         {/* You can loop through image URLs and generate these dynamically */}
//         <img src="path_to_image1" alt="Scenery 1" />
//         <img src="path_to_image2" alt="Scenery 2" />
//         <img src="path_to_image3" alt="Scenery 3" />
//       </div>
//       <div className="post-footer">
//         {/* ... Add like, comment icons and counts here ... */}
//       </div>
//     </div>
//   );
// }

export default UserPost;
