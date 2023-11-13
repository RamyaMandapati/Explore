import React from 'react';
import './contacts.css';
import person1 from './person1.jpeg';
import person2 from './person2.jpeg';

const Contacts = () => {
  const chatContacts = [
    { id: 1, name: "Cierra Vega", avatar: person1 },
    { id: 2, name: "Alden Cantrell", avatar: person2 },
    { id: 3, name: "Kierra Gentry", avatar: person1 },
    { id: 4, name: "Bradyn Kramer", avatar: person2 },
    { id: 5, name: "Thomas Crane", avatar: person1 },
    // ... add more contacts if needed
  ];

  return (
    <div className='contacts'>
    <div className="contacts-container">
      <h2>Contacts</h2>
      <ul>
        {chatContacts.map(contact => (
          <li key={contact.id} className="contact-item">
            <img src={contact.avatar} alt={`Avatar of ${contact.name}`} />
            <span>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Contacts;
