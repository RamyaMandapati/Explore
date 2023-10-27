import "./Login.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
export const Preferences = ({ history }) => {
  const dispatch = useDispatch();

  const preference = [
    "Hiking",
    "Nigtlife",
    "Museum",
    "Park",
    "Bridge",
    "Neighborhood",
    "Landmark",
    "Kid-friendly",
    "Beach",
    "Amusement Park",
    "Restaurant",
    "Fishing",
    "Music",
    "Diving",
    "Dancing",
    "Mountain Biking",
    "Rafting",
    "Surfing",
    "Sailing",
    "Camping",
  ];
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [userLocation, setUserLocation] = useState({
    country: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    // Get the user's geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use a reverse geocoding API to get location data
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=c0b357c31eff4831abdb2e23137b5c87`
          );

          const { country, city, state } =
            response.data &&
            response.data.features &&
            response.data.features[0].properties;
          setUserLocation({ country, city, state });
        } catch (error) {
          console.error("Error getting location data:", error);
        }
      });
    }
  }, []);

  const togglePreference = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(
        selectedPreferences.filter((item) => item !== pref)
      );
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };
  const { user } = useSelector((state) => state.auth);

  const onSubmit = () => {
    const userId = user && user._id;
    const data = {
      userId: userId,
      interestedActivity: selectedPreferences,
      country: userLocation.country,
      city: userLocation.city,
      state: userLocation.state,
    };
    axios
      .put("/api/pref", data)
      .then((response) => {
        dispatch(loadUser()).then(history.push("/plan"));
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };
  return (
    <>
      <div className="pref-cont">
        <div className="pref-heading">
          <h3>Add your Preferences</h3>
          <h4> Please select atleast one</h4>
        </div>
        <div className="pref-button">
          {preference &&
            preference.map((pref, index) => (
              <button
                key={index}
                type="submit"
                className={`pref-plan-button ${
                  selectedPreferences.includes(pref) ? "pref-button-select" : ""
                }`}
                onClick={() => togglePreference(pref)}
              >
                {pref}
              </button>
            ))}
        </div>
        <button
          className="planbutton planbutton1"
          style={{ width: "120px", marginTop: "0px" }}
          onClick={() => onSubmit()}
        >
          Submit
        </button>
      </div>
    </>
  );
};
export default Preferences;
