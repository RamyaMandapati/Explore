// ItinerariesComponent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./ItinariesComponent.css";
import Navbar from "../Navbar/Navbar.js";
import "./ItinariesComponent.css";

const ItinerariesComponent = ({ history }) => {
  const [itineraries, setItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Use axios to fetch data
    axios
      .get("http://localhost:4000/api/itinerary")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setItineraries(response.data.data);
        }
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // You can call other functions here or do further processing based on the value
    searchItineraries(value);
  };
  const formatDate = (dateString) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const searchItineraries = (term) => {
    // Search the itineraries or make an API call based on the term
    axios
      .get("http://localhost:4000/api/itinerary?destination=" + term)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setItineraries(response.data.data);
        }
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const itineraryRedirect = (itineraryId) => {
    history.push(`/itinerary/${itineraryId}`);
  };

  return (
    <div className="itineraries-main">
      {/* <Navbar /> */}
      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search for Itineraries"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </section>
      <section className="itineraries-section">
        <h3>Itineraries</h3>
        {itineraries.map((itinerary, index) => (
          <div
            key={index}
            className="card"
            onClick={() => itineraryRedirect(itinerary._id)}
          >
            <img src={itinerary.imageUrl} alt="Itinerary" />
            <div className="card-info">
              <p className="location">
                <span role="img" aria-label="pin">
                  📍
                </span>{" "}
                {itinerary.destination}
              </p>
              <p className="date">
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                {formatDate(itinerary.startDate)}-
                {formatDate(itinerary.endDate)}{" "}
              </p>
            </div>
          </div>
        ))}
      </section>
      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
};

export default ItinerariesComponent;
