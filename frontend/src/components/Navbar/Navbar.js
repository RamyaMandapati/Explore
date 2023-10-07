import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons'; // Import the messenger icon
import './Navbar.css'; // You can create a CSS file for styling
import logo from '../../logo.png';
import profile from '../../profilepic.jpeg';
import {Travelfeed} from '../dashboard/Travelfeed.js';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to ="/TravelFeed">
          <img className="logo" src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search for Places, People or Tags" />
      </div>
      <div className="message">
        <div className="messenger-icon">
          <FontAwesomeIcon icon={faComments} size="lg" />
        </div>
      
        <div className="profile">
          <img
            className="profile-image"
            src={profile}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="dropdown">
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
