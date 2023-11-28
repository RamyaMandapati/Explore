import React, { useState, useEffect } from "react";
import axios from "axios";
import "./contacts.css";
import profilephoto from "../../profilepic.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
const Contacts = ({ history }) => {
  const [contacts, setContacts] = useState([]);
  const [suggestedContacts, setSuggestedContacts] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }

    // Fetching followers
    axios.post(`http://localhost:4000/api/user/email`, { email: user.email })
      .then(response => {
        const { followers, following } = response.data;
        console.log(followers, following);
        const uniqueContactsMap = new Map();

    // Add followers and following to the map
    [followers, following].flat().forEach(contact => {
      uniqueContactsMap.set(contact._id, contact);
    });

    // Convert the map values back to an array
    const combinedContacts = Array.from(uniqueContactsMap.values());
    setContacts(combinedContacts);
      })
      .catch(error => console.error("Error fetching followers", error));
  }, [dispatch, user]);

    // Fetching suggested contacts based on interestedActivity
    useEffect(() => {
      // Make sure this effect runs only when `contacts` is updated
      if (contacts.length > 0 && user) {
        axios.post(`http://localhost:4000/api/users/interestedActivity`, { 
          interestedActivity: user.interestedActivity, 
          userId: user._id  
        })
        .then(response => {
          console.log(response.data);
          const contactsIds = new Set(contacts.map(contact => contact._id));
          const filteredContacts = response.data.filter(contact => 
            !contactsIds.has(contact._id) && contact._id !== user._id
          );
          setSuggestedContacts(filteredContacts);
        })
        .catch(error => console.error("Error fetching suggested contacts", error));
      }
    }, [contacts, user]);

  const handleMessage = (receiverId) => {
    axios.post(`/api/conversation`, {
      senderId: user && user._id,
      receiverId: receiverId,
    })
    .then(response => {
      if (response.data) {
        history.push(`/messenger/${response.data._id}`);
      }
    })
    .catch(error => console.error("Error creating conversation", error));
  };

  return (
    <div className="contacts-container">
      <h2>Contacts</h2>
      <ul>
        {contacts?.map((contact) => (
          <li key={contact._id} className="contact-item" onClick={() => handleMessage(contact._id)}>
            <img src={contact.profilePhoto || profilephoto} alt="Profile" />
            <span>{contact?.userName}</span>
          </li>
        ))}
      </ul>
      <h2 style={{ marginTop: "30px" }}>Suggested Contacts</h2>
      <ul>
        {suggestedContacts?.map((contact) => (
          <li key={contact._id} className="contact-item" onClick={() => handleMessage(contact._id)}>
            <img src={contact.profilePhoto || profilephoto} alt="Profile" />
            <span>{contact?.userName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
