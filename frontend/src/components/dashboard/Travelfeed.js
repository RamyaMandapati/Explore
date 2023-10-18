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
              </div>
          </div>
      </div>
  );
}


export default Travelfeed;

// Filters.js







