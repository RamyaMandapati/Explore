// CreatePostComponent.jsx

import React, { useState } from 'react';
import './Newpost.css';

const Newpost = () => {
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => file.name);
    setFileNames(files);
  };

  return (
    <div className="create-post-container">
      <h2>Creating a new Post</h2>
      <form>
        <label>Type</label>
        <select>
          <option>Upcoming</option>
          <option>Past</option>
          <option>Present</option>
        </select>

        <label>Title</label>
        <input type="text" placeholder="Enter trip title" />

        <label>Place</label>
        <input type="text" placeholder="Enter place name" />

        <label>Location</label>
        <input type="text" placeholder="Provide city, state" />

        <label>Date</label>
        <input type="date" /> to <input type="date" />

        <label>Budget</label>
        <input type="number" placeholder="Enter budget amount" />

        <label>Images</label>
        <input type="file" multiple onChange={handleFileChange} />

        <div className="file-list">
          {fileNames.map((name, index) => (
            <span key={index}>{name}</span>
          ))}
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
}

export default Newpost;
