// ItinerariesComponent.jsx

import React from 'react';
import './ItinariesComponent.css';
import person1 from '../dashboard/person1.jpeg';
import person2 from '../dashboard/person2.jpeg';
import Navbar from '../Navbar/Navbar.js';

const ItinerariesComponent = () => {
  const itineraries = [
    {
      image: person1,
      location: 'California, California, USA',
      date: 'Apr 20, 2023 - Apr 27, 2023'
    },
    {
      image: person2,
      location: 'San Jose, California, USA',
      date: 'Apr 20, 2023 - Apr 27, 2023'
    },
    {
      image: person1,
      location: 'Los Angeles, California, USA',
      date: 'Apr 20, 2023 - Apr 27, 2023'
    },
    // ... add more itineraries as needed
  ];

  return (
    <div className="itineraries-main">
     
      <Navbar/>
      <section className="search-section">
        
        <input type="text" placeholder="Search for Itineraries" />
      </section>
      <section className="itineraries-section">
        <h3>Itineraries</h3>
        {itineraries.map((itinerary, index) => (
          <div key={index} className="card">
            <img src={itinerary.image} alt="Itinerary" />
            <div className="card-info">
              <p className="location"><span role="img" aria-label="pin">📍</span> {itinerary.location}</p>
              <p className="date"><span role="img" aria-label="calendar">📅</span> {itinerary.date}</p>
            </div>
          </div>
        ))}
      </section>
      <footer>
        {/* Footer content goes here */}
      </footer>
    </div>
  );
}

export default ItinerariesComponent;
