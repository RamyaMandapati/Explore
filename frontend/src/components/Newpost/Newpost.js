// CreatePostComponent.jsx

import React, { useState, useEffect } from "react";
import "./Newpost.css";
import axios from "axios";
import { uploadImages } from "../../utils/cloudImage";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/auth";
import { useHistory } from "react-router-dom";

import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
const ModalWrapper = ({ children, onClose }) => {
  return (
    <div
      className="modal-wrapper"
      // Close the modal when the background is clicked
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Make sure it's above everything else
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent click from closing the modal */}
        {children}
      </div>
    </div>
  );
};
const Newpost = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAUmGqs6vCSNoKHWwvYfifpkOJ5lZLrUBo", // Replace with your API key
    libraries: ["drawing", "places", "geometry"],
  });
  const history = useHistory();

  const onLoad = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log(place);
      // You can extract the address components and set them to your state or form fields
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
    history.push("/travelFeed");
  };

  // Render nothing if modal is not open

  const [files, setFiles] = useState([]);
  // Changed to store file objects
  const [itineraries, setItineraries] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user._id);
  const handleFileChange = (e) => {
    setFiles(e.target.files); // Directly store the FileList object
  };
  useEffect(() => {
    // If user is not available, dispatch action to load user
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]); // Add appropriate dependencies here

  useEffect(() => {
    // Fetch itineraries only when user._id is available
    if (user?._id) {
      axios
        .get(`http://localhost:4000/api/itinerary/user/${user._id}`)
        .then((response) => {
          setItineraries(response.data.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [user?._id]); // user?._id is a dependency, re-run this effect if it changes
  if (!isModalOpen) return null;
  const renderItineraryOptions = () => {
    return itineraries.map((itinerary) => (
      <option key={itinerary._id} value={itinerary._id}>
        {itinerary.itineraryName}{" "}
        {/* Assuming each itinerary has a title property */}
      </option>
    ));
  };
  const postdata = async (event) => {
    event.preventDefault();

    try {
      // Upload images first and get their URLs
      const imageUrls = await uploadImages(files);

      // Create an instance of FormData
      const formData = new FormData();

      // Append each form field to the formData object
      // formData.append('type', event.target.type.value);
      formData.append("title", event.target.title.value);
      formData.append("description", event.target.description.value);
      formData.append("user", user?._id);
      formData.append("location", event.target.location.value);
      formData.append("fromDate", event.target.fromdate.value);
      formData.append("toDate", event.target.todate.value);
      formData.append("budget", event.target.budget.value);
      formData.append("minAge", event.target.minAge.value);
      formData.append("maxAge", event.target.maxAge.value);
      formData.append("itineraryId", event.target.itineraries.value);

      // Append the URLs of uploaded images
      imageUrls.forEach((url) => formData.append("imageUrls", url));
      console.log("Form Data:", Array.from(formData.entries()));

      // Send the form data with the image URLs to your API
      const response = await axios.post(
        "http://localhost:4000/api/addPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      // Handle the successful submission here
      closeModal();
      history.push("/travelFeed");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }

      // Handle the error here
    }
  };
  if (!isLoaded) return <div>Loading...</div>;

  // Render Autocomplete only when API is loaded

  return (
    <ModalWrapper onClose={closeModal}>
      <div
        className="create-post-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={closeModal}>
          ×
        </button>

        <h2>Creating a new Post</h2>
        <form onSubmit={postdata}>
          <label>Type</label>
          <select name="type">
            <option>Upcoming</option>
            <option>Past</option>
            <option>Present</option>
          </select>
          <label>Title</label>
          <input type="text" name="title" placeholder="Enter trip title" />
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Write something about your trip..!!"
          />
          <label>Location</label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              name="location"
              placeholder="Provide city, state"
            />
          </Autocomplete>
          <label>Date</label>
          <input name="fromdate" type="date" /> to{" "}
          <input name="todate" type="date" />
          <label>Age Preference</label>
          <input name="minAge" type="age" /> to{" "}
          <input name="maxAge" type="age" />
          <label>Link itinerary</label>
          <select name="itineraries">
            <option value="">Select an itinerary</option>
            {renderItineraryOptions()}
          </select>
          <label>Budget</label>
          <input
            type="number"
            name="budget"
            placeholder="Enter budget amount"
          />
          <label>Gender Preference</label>
          <select name="gender">
            <option>Any</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-Binary</option>
          </select>
          <label>Images</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
          />
          <div className="files">
            {Array.from(files).map((file, index) => (
              <span key={index}>{file.name}</span> // Access the name property of the File object
            ))}
          </div>
          <button type="submit">Next</button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default Newpost;
