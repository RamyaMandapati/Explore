import React from 'react';
import './Travelfeed.css';

function Filter() {
    return (
        <div className="filters">
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
