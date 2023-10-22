// Dashboard.js
import React from "react";
import Filters from "./Filters";
import PopularItineraries from "./Popularitineraries";
import Navbar from "../Navbar/Navbar";
import "./Travelfeed.css";
import UserPosts from "./Userpost";
import Contacts from "./contacts.js";

function Travelfeed() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="container">
        <div className="filters">
          <Filters />
        </div>
        <div className="main-content">
          <div className="itineraries">
            <PopularItineraries />
          </div>
          <div className="userposts">
            <UserPosts />
          </div>
          <Contacts />
        </div>
      </div>
    </div>
  );
}

// import UserPost from './Userpost';

// function Travelfeed() {
//   return (
//     <div className="dashboard">
//       {/* <Filters /> */}
//       <Navbar/>
//       <PopularItineraries />

//       {/* <UserPost /> */}
//       {/* Add other components as needed */}
//     </div>
//   );
// }

export default Travelfeed;

// Filters.js
