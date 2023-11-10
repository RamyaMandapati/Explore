// Dashboard.js
import React from "react";
import Filters from "./Filters";
import PopularItineraries from "./Popularitineraries";
import Navbar from "../Navbar/Navbar";
import "./Travelfeed.css";
import UserPosts from "./Userpost";
import Contacts from "./contacts.js";
import { useState, useEffect } from "react";

function Travelfeed() {
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Handlers to update the filters
  const handleGenderFilterChange = (newGender) => {
    setGenderFilter(newGender);
  };

  const handleAgeFilterChange = (newAge) => {
    setAgeFilter(newAge);
  };

  const handleCountryFilterChange = (newCountry) => {
    setCountryFilter(newCountry);
  };
  return (
    <div className="dashboard">
      <Navbar />

      <div className="container">
      <div className="filters">
      <Filters
        onGenderFilterChange={handleGenderFilterChange}
        onAgeFilterChange={handleAgeFilterChange}
        onCountryFilterChange={handleCountryFilterChange}
        genderFilter={genderFilter}
        ageFilter={ageFilter}
        countryFilter={countryFilter}
      />
    </div>
        <div className="main-content">
          <div className="itineraries">
            <PopularItineraries />
          </div>
          <div className="userposts">
      <UserPosts
        genderFilter={genderFilter}
        ageFilter={ageFilter}
        countryFilter={countryFilter}
      />
    </div>
          <div className="userposts">
            <Contacts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Travelfeed;

// Filters.js
