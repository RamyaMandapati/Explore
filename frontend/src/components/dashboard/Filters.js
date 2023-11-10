import React from 'react';
import './Travelfeed.css';
import './Filters.css';

// Filters.js
function Filter({ onGenderFilterChange, onAgeFilterChange, onCountryFilterChange, genderFilter, ageFilter, countryFilter }) {
    return (
      <div className="filters">
        {/* ... */}
        <div className="filter-item">
          <label>Gender:</label>
          <input
            type="text"
            placeholder="..."
            value={genderFilter}
            onChange={(e) => onGenderFilterChange(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Age:</label>
          <input
            type="text"
            placeholder="..."
            value={ageFilter}
            onChange={(e) => onAgeFilterChange(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Country:</label>
          <input
            type="text"
            placeholder="..."
            value={countryFilter}
            onChange={(e) => onCountryFilterChange(e.target.value)}
          />
        </div>
        {/* ... */}
      </div>
    );
  }
  
  export default Filter;
  


