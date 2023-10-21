import React from 'react';
import './Popularitineraries.css';  // Replace 'YourStylesheetName' with the name of your SCSS file
import personImage from './person1.jpeg';
import placeImage from './person2.jpeg';
const PopularItineraries = () => {
  const data = [
    {
      id: 1,
      name: 'Kierra Gentry',
      personImage: personImage,
      placeImage: placeImage
    },
    {
        id: 2,
        name: 'Ramya',
        personImage: personImage,
        placeImage: placeImage
    },
      {
        id: 3,
        name: 'Kierra Gentry',
        personImage: personImage,
        placeImage: placeImage
      },
      {
          id: 4,
          name: 'Kierra Gentry',
          personImage: placeImage,
          placeImage: personImage
        },
        {
            id: 5,
            name: 'Kierra Gentry',
            personImage: personImage,
            placeImage: placeImage
          },
          {
              id: 6,
              name: 'Kierra Gentry',
              personImage: placeImage,
              placeImage: personImage
            },
            {
              id: 7,
              name: 'Kierra Gentry',
              personImage: placeImage,
              placeImage: personImage
            },
    // ... you can add more items here
  ];

  return (
    <div className="popular-itineraries">
    
      {data.map(itinerary => (
        <div className="itinerary-card" key={itinerary.id}>
          <img src={itinerary.placeImage} alt={itinerary.name + ' place'} className="place" />
          <img src={itinerary.personImage} alt={itinerary.name} className="person" />
          <div className="name">{itinerary.name}</div>
        </div>
      ))}
    </div>
  );
}

export default PopularItineraries;
