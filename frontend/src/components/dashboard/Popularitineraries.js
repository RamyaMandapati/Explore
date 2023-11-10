import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Popularitineraries.css'; // Assuming this is the correct stylesheet
import personImage from './person1.jpeg'; // Default image if not provided by the API
import placeImage from './person2.jpeg'; // Default image if not provided by the API

const PopularItineraries = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/itinerary');
        console.log(response.data.data);
        // Assuming the API returns an array of itineraries
        setItineraries(response.data.data.slice(0, 7)); // Take the first 7 itineraries
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className="popular-itineraries" style={{display:"block"}}>
      <div>
      <label>popular itineraries</label>
      </div>
      {itineraries.map((itinerary, index) => (
        <div className="itinerary-card" key={itinerary._id || index}>
          <img src={itinerary.imageUrl || placeImage} alt={`${itinerary.name}'s place`} className="place" />
          <img src={itinerary.createdBy.profilePicture || personImage} alt={itinerary.name} className="person" />
          <div className="name">{itinerary.createdBy.userName}</div>
        </div>
      ))}
    </div>
  );
}

export default PopularItineraries;
