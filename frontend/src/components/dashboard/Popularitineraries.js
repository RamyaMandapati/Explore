import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Popularitineraries.css"; // Assuming this is the correct stylesheet
import personImage from "./person1.jpeg"; // Default image if not provided by the API
import placeImage from "./person2.jpeg"; // Default image if not provided by the API
import { Link } from "react-router-dom";
//import itinariesComponent from '../itinariesComponent/itinariesComponent';
const PopularItineraries = ({ history }) => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/itinerary");
        console.log(response.data.data);
        // Assuming the API returns an array of itineraries
        setItineraries(response.data.data.slice(0, 5)); // Take the first 7 itineraries
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className="popular-container">
      <div>
        <h2 style={{ fontSize: "16px" }}>Popular Itineraries</h2>
      </div>
      <div className="popular-itineraries">
        {itineraries.map((itinerary, index) => (
          <div
            className="itinerary-card"
            key={itinerary._id || index}
            onClick={() => history.push(`/itinerary/${itinerary._id}`)}
          >
            <img
              src={itinerary.imageUrl || placeImage}
              alt={`${itinerary.name}'s place`}
              className="place"
            />
            {/* <img src={itinerary.createdBy.profilePicture || personImage} alt={itinerary.name} className="person" /> */}
            <div className="name">{itinerary.destination}</div>
          </div>
        ))}
        <Link
          to="/itineraries"
          className="see-all-link"
          style={{ marginTop: "20px" }}
        >
          See All
        </Link>
      </div>
    </div>
  );
};

export default PopularItineraries;
