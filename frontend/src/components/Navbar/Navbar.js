import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons"; // Import the messenger icon
import "./Navbar.css"; // You can create a CSS file for styling
import logo from "../../logo.png";
import profile from "../../profilepic.jpeg";
import { Travelfeed } from "../dashboard/Travelfeed.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../actions/types";
import { useHistory } from "react-router-dom";
import { loadUser } from "../../actions/auth";

const Navbar = () => {
  const history = useHistory();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  // Function to toggle the profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // useEffect(() => {
  //   dispatch(loadUser());
  // }, []);
  const logout = () => {
    axios
      .post("/logout")
      .then((response) => {
        dispatch({ type: "LOGOUT" });
        if (history) {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/TravelFeed">
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
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
