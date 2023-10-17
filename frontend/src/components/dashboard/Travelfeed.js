// Dashboard.js
import React from 'react';
import Filters from './Filters';
import PopularItineraries from './Popularitineraries';
import Navbar from '../Navbar/Navbar';
import './Travelfeed.css';

import UserPost from './Userpost';

function Travelfeed() {
  return (
    <div className="dashboard">
      {/* <Filters /> */}
      <Navbar/>
      <PopularItineraries />
 
      {/* <UserPost /> */}
      {/* Add other components as needed */}
    </div>
  );
}

export default Travelfeed;

// Filters.js







