import React from 'react';
import './Travelfeed.css';
import './Filters.css';

function Filter() {
    return (
        <div className="filters">
            <label style={{marginBottom:"20px"}}>Filters</label>
            <div className="filter-item">
                <label>Gender:</label>
                <input type="text" placeholder="..." />
            </div>
            <div className="filter-item">
                <label>Age:</label>
                <input type="text" placeholder="..." />
            </div>
            <div className="filter-item">
                <label>Country:</label>
                <input type="text" placeholder="..." />
            </div>
        </div>
    );
}

export default Filter;
