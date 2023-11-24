import React from 'react';
import './Travelfeed.css';
import './Filters.css';

// Filters.js
function Filter({ onGenderFilterChange, onAgeFilterChange,  genderFilter, ageFilter, budgetFilter,onBudgetFilterChange }) {
    return (
      <div className="filters-container">
        <h3 style={{marginBottom:"20px"}}>Filters</h3>
        <div className="filter-item">
  <label>Gender:</label>
  <select value={genderFilter} onChange={(e) => onGenderFilterChange(e.target.value)}>
    <option value="">Any</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Non-Binary">Non-Binary</option>
    
  </select>
</div>



<div className="filter-item">
  <label>Age:</label>
  <select style={{marginLeft:"35px"}}value={ageFilter} onChange={(e) => onAgeFilterChange(e.target.value)}>
    <option value="">Any</option>
    <option value="20-30">20-30</option>
    <option value="31-40">31-40</option>
    <option value="41-50">41-50</option>
    <option value="50+">50+</option>
  </select>
</div>

<div className="filter-item">
  <label>Budget:</label>
  <select value={budgetFilter} onChange={(e) => onBudgetFilterChange(e.target.value)}>
    <option value="">Any</option>
    <option value="<500">&lt;500$</option>
    <option value="<1000">&lt;1000$</option>
    <option value="<2000">&lt;2000$</option>
    <option value="<5000">&lt;5000$</option>
    <option value="5000+">5000$+</option>
  </select>
</div>

        {/* ... */}
      </div>
    );
  }
  
  export default Filter;
  


