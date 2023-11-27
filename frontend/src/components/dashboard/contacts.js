import React from "react";
import "./contacts.css";
import person1 from "./person1.jpeg";
import person2 from "./person2.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
import { useState, useEffect } from "react";
import profilephoto from "../../profilepic.jpeg";
import axios from "axios";
const Contacts = ({ history }) => {
  const [contacts, setContacts] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user._id);
  const userId = user._id;
  const email = user.email;

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
    console.log(email);
    axios
      .post(`http://localhost:4000/api/user/email`, { email: user.email })
      .then((response) => {
        // Handle the response
        console.log(response.data);
        setContacts(response.data?.followers);
        console.log(contacts);
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });
  }, [dispatch, user]);

  const handleMessage = (receiverId) => {
    axios
      .post(`/api/conversation`, {
        senderId: user && user._id,
        receiverId: receiverId,
      })
      .then((response) => {
        console.log("response");
        if (response.data) {
          history.push(`/messenger/${response.data._id}`);
        }
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="contacts-container">
      <h2>Contacts</h2>
      <ul>
        {contacts?.map((contact) => (
          <li
            key={contact._id}
            className="contact-item"
            onClick={() => handleMessage(contact._id)}
          >
            <img src={contact.profilePhoto || profilephoto} />
            <span>{contact?.userName}</span>
          </li>
        ))}
      </ul>
      <h2 style={{ marginTop: "30px" }}>Suggested contacts</h2>
      <ul>
        {contacts?.map((contact) => (
          <li
            key={contact._id}
            className="contact-item"
            onClick={() => handleMessage(contact._id)}
          >
            <img src={contact.profilePhoto || profilephoto} />
            <span>{contact?.userName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
