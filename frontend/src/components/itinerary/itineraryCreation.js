import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  StandaloneSearchBox,
  Marker,
  OverlayView,
} from "@react-google-maps/api";

import "./itinerary.css";
import ItineraryTime from "./itineraryTime";
import { useSelector } from "react-redux";
import moment from "moment";

const libraries = ["drawing", "places", "geometry"];

export const ItineraryCreation = ({ history }) => {
  const [image, setImage] = useState(
    "https://media.timeout.com/images/105770969/1372/772/image.jpg"
  );
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [address, setAddress] = useState("");
  const [map, setMap] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);
  const [searchLocation, setSearchLocation] = React.useState(null);
  const [isTime, setisTime] = React.useState(false);
  const [isCost, setisCost] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [markers, setMarkers] = useState([]);
  const itineraryplandet = useSelector(
    (state) => state.itinerary.itineraryplandet
  );
  const itineraryLocation = `Trip to ${
    itineraryplandet && itineraryplandet.location.split(",")[0].trim()
  }`;
  const startDate = moment(itineraryplandet && itineraryplandet.startDate.$d);
  const endDate = moment(itineraryplandet && itineraryplandet.endDate.$d);
  const tripStartDate = startDate.format("MM/DD");
  const tripEndDate = endDate.format("MM/DD");

  const dateArray = [];

  while (startDate <= endDate) {
    dateArray.push(
      startDate.format("dddd") + ", " + startDate.format("MMMM Do")
    );
    startDate.add(1, "days"); // Move to the next day
  }
  dateArray.push(endDate.format("dddd") + ", " + endDate.format("MMMM Do"));

  const [tripName, setTripName] = React.useState(itineraryLocation);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAUmGqs6vCSNoKHWwvYfifpkOJ5lZLrUBo",
    libraries,
  });

  const [sideButton, setSideButton] = useState(true);
  const buttonSelect = () => {
    if (sideButton) {
      setSideButton(false);
    } else {
      setSideButton(true);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    if (isLoaded && lat && lng) {
      console.log("updating recent location");
      updateMapWithRecentLocation(parseFloat(lat), parseFloat(lng));
      // console.log(lat,lng);
    }
  }, [markers, address, lat, lng]);

  const containerStyle1 = {
    width: "460px",
    height: "100%",
  };

  const center = {
    lat: 37,
    lng: -122,
  };

  const markerPositions = [
    { lat: 40.7128, lng: -74.006 }, // Example marker position 1
    { lat: 40.7228, lng: -74.016 }, // Example marker position 2
    // Add more marker positions as needed
  ];

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onSBLoad = (ref) => {
    setSearchBox(ref);
  };

  const updateMapWithRecentLocation = (lt, lg) => {
    const bounds = new window.google.maps.LatLngBounds();
    const path = {
      lat: lt,
      lng: lg,
    };
    bounds.extend(path);
    map.setOptions({ maxZoom: 16 });
    map.fitBounds(bounds);
    map.setOptions({ maxZoom: null });
    setMap(map);
  };

  const handleDateButton = () => {
    history.push("/");
  };

  const onPlacesChanged = () => {
    let results = searchBox.getPlaces();
    const placeName = results && results.length ? results[0].name : "";
    setSearchLocation(placeName);
    const bounds = new window.google.maps.LatLngBounds();
    for (let i = 0; i < results.length; i++) {
      let place = results[i].geometry.location;
      const path = {
        lat: place.lat(),
        lng: place.lng(),
      };
      bounds.extend(path);
    }
    map.setOptions({ maxZoom: 16 });
    map.fitBounds(bounds);
    map.setOptions({ maxZoom: null });
    setMap(map);
  };

  const placeClicked = (e) => {
    // console.log(e);
    const geocoder = new window.google.maps.Geocoder();
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    const tempMarkers = [];
    tempMarkers.push({
      title: "trip Location",
      name: "empty",
      position: { lat, lng },
    });
    setLat(lat);
    setLng(lng);
    geocoder.geocode({ location: { lat, lng } }).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
    setMarkers(tempMarkers);
    console.log("completed recent location");
  };

  const handleSearchChange = (e) => {
    const {
      target: { value },
    } = e;
    if (!value) {
      setSearchLocation("");
    }
  };

  async function getImage() {
    const url = `https://pixabay.com/api/?key=35714305-8294bdfc234a78b237b91a723&q=chicago&image_type=photo&per_page=10&safesearch=True&category=places&editors_choice=True`;
    const res = await axios.get(url);
    console.log(res);
    const ind = Math.floor(Math.random() * 10);
    setImage(res.data.hits[ind].webformatURL);
  }

  const containerStyle = {
    backgroundImage: `linear-gradient(180deg,rgba(33,37,41,.5) 0,transparent 50%), url(https://media.timeout.com/images/105770969/1372/772/image.jpg)`, // Set the dynamic image URL
    backgroundSize: "cover", // Adjust as needed
    backgroundRepeat: "no-repeat", // Adjust as needed
    // Add other styles as needed
    width: "100%", // Set dimensions and other styles
    height: "240px",
    position: "relative",
  };
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // You can perform additional actions with the selected file here.
      console.log(`Selected file: ${file.name}`);
    }
  };

  const openFileInput = () => {
    // Trigger a click event on the hidden file input
    document.getElementById("fileInput").click();
  };
  return (
    <div className="itinerarycreation">
      <div className="itineraryplan">
        <div className="itineraryimage">
          <div className="image" style={containerStyle} onClick={openFileInput}>
            <button className="btn btn-1">
              <div className="btn-icon">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="pencil"
                  class="svg-inline--fa"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                  ></path>
                </svg>
              </div>
            </button>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
          </div>
          <div className="itineary-container">
            <div className="mt-2">
              <div className="Input_tripName">
                <input
                  type="text"
                  placeholder="Enter a Trip Name"
                  className="input_trip"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="date-flex space-flex">
              <button
                type="button"
                className="btn-date btn-date1"
                onClick={handleDateButton}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="calendar-days"
                  class="svg-inline--fa fa-calendar-days fa-w-14 fa-fw mr-2"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"
                  ></path>
                </svg>
                <span>
                  {tripStartDate} - {tripEndDate}
                </span>
              </button>
              <div className="add-flex">
                <button
                  className="btn btn-2"
                  style={{ backgroundColor: "#dee2e6" }}
                >
                  I
                </button>
                <button className="btn btn-3">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="user-plus"
                    class="svg-inline--fa fa-user-plus fa-w-20 fa-fw fa-1x "
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    color="#6c757d"
                  >
                    <path
                      fill="currentColor"
                      d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="planboardspacer"></div>
        <div className="itinerary-plan">
          <div className="space-flex mb-4">
            <h2>Itinerary</h2>
            <div className="space-flex">
              <button
                type="button"
                className="btn-date btn-date2"
                onClick={handleDateButton}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="calendar-days"
                  class="svg-inline--fa fa-calendar-days fa-w-14 fa-fw mr-2"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"
                  ></path>
                </svg>
                <span>
                  {tripStartDate} - {tripEndDate}
                </span>
              </button>
            </div>
          </div>
          {dateArray &&
            dateArray.map((date, index) => (
              <div key={index}>
                <div className="add-flex ml-n5 pl-5 mb-4">
                  <button className="sectionbutton" onClick={buttonSelect}>
                    {sideButton ? (
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="chevron-right"
                        class="svg-inline--fa fa-chevron-right fa-w-14 fa-fw fa-sm "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        color="#212529"
                      >
                        <path
                          fill="currentColor"
                          d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="chevron-down"
                        class="svg-inline--fa fa-chevron-down fa-w-14 fa-fw fa-sm "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        color="#212529"
                      >
                        <path
                          fill="currentColor"
                          d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                        ></path>
                      </svg>
                    )}
                  </button>
                  <div>
                    <div className="sectionHeader add-flex add-flexgap">
                      <button type="button" className="sectionheaderdate">
                        {date}
                      </button>

                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="calendar-days"
                        class="svg-inline--fa svg-inline--fa-small fa-calendar-days fa-w-14 fa-xs ml-4 mr-1 d-print-none"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="currentColor"
                          d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"
                        ></path>
                      </svg>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      {sideButton ? (
                        <span
                          style={{
                            color: "#6c757d",
                            fontWeight: "700",
                          }}
                        >
                          1 place
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {!sideButton ? (
                    <div>
                      <div className="itinerary-plan-box">
                        <div class="BlockLeftIconContainer BlockLeftIconContainer__absolute py-2">
                          <span
                            class="MarkerIconWithColor"
                            style={{ fontSize: "2rem" }}
                          >
                            <span class="MarkerIconWithColor__label MarkerIconWithColor__labelLarge">
                              1
                            </span>
                            <span
                              class="MarkerIconWithColor__outlined"
                              style={{
                                color: "rgb(63, 82, 227)",
                                stroke: "#d2d6f8",
                                strokeWidth: "40",
                              }}
                            >
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="location-pin"
                                class="svg-inline--fa  svg-inline--fa-icon fa-location-pin fa-w-12 "
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="add-flex-column pl-2">
                          <button className="plan__button">
                            <span>San Jose</span>
                            <svg
                              aria-labelledby="svg-inline--fa-title-lnKUevjzaCSO"
                              data-prefix="fas"
                              data-icon="pen"
                              class="svg-inline--fa svg-inline--fa-medium fa-pen fa-w-16 fa-xs ml-2"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              {/* <title id="svg-inline--fa-title-lnKUevjzaCSO">Edit</title> */}
                              <path
                                fill="currentColor"
                                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                              ></path>
                            </svg>
                          </button>
                          <div className="mb-2 input_item_plan">
                            <input
                              type="text"
                              className="desc_input_plan"
                              placeholder="add description here"
                            />
                          </div>
                          <div className="add-flex mb-2">
                            <div className="mt-n3 mb-n2">
                              <button
                                type="button"
                                className="btn-date btn-date1"
                                style={{ position: "relative" }}
                                onClick={() => setisTime(true)}
                              >
                                <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  data-prefix="far"
                                  data-icon="clock"
                                  class="svg-inline--fa fa-clock fa-w-16 fa-fw fa-sm h-n3"
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                                  ></path>
                                </svg>
                                <span className="ml-2">Add time</span>
                                {/* <span
            style={{
              padding: "0 8px",
              fontSize: "12px",
            }}
          >
            12:30 Am to 12:30 PM
          </span> */}
                              </button>
                              {isTime ? (
                                <ItineraryTime setisTime={setisTime} />
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="mt-n3 mb-n2">
                              <button
                                type="button"
                                className="btn-date btn-date1"
                                style={{
                                  position: "relative",
                                }}
                                onClick={() => setisCost(true)}
                              >
                                <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  data-prefix="fas"
                                  data-icon="dollar-sign"
                                  class="svg-inline--fa fa-dollar-sign fa-w-16 fa-fw fa-sm h-n3"
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 320 512"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M146 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3C4.9 411.4-2.4 392.5 4.8 376.3s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C105.4 279.3 70.4 270 44.4 253c-14.2-9.3-27.5-22-35.8-39.6C.3 195.4-1.4 175.4 2.5 154.1C9.7 116 38.3 91.2 70.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z"
                                  ></path>
                                </svg>
                                <span>$100</span>
                              </button>
                              {isCost ? (
                                <div className="drop-down-menu1">
                                  <div className="add-flex cost_box">
                                    <span>$</span>
                                    <input
                                      type="text"
                                      placeholder="0"
                                      className="cost_input"
                                    />
                                  </div>
                                  <div class="d-flex pt-2 mb-20 justify-content-center">
                                    <button
                                      type="button"
                                      className="Button Button__light-gray Button__md Button__label Button__shape__pill overflow-hidden Button__withLabel mr-2"
                                      onClick={() => setisCost(false)}
                                    >
                                      clear
                                    </button>
                                    <button
                                      type="submit"
                                      className="Button Button__brand Button__label Button__md Button__shape__pill overflow-hidden Button__withLabel"
                                      onClick={() => setisCost(false)}
                                    >
                                      save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {isLoaded ? (
                        <div className="searchbox">
                          <StandaloneSearchBox
                            onLoad={onSBLoad}
                            onPlacesChanged={onPlacesChanged}
                          >
                            <input
                              className="search_input"
                              type="search"
                              placeholder="Add a place"
                              onChange={handleSearchChange}
                            />
                          </StandaloneSearchBox>
                          <div class="InputIconWrapper__left text-muted">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="location-dot"
                              class="svg-inline--fa fa-location-dot fa-w-14 fa-w-12 fa-fw "
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="currentColor"
                                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div class="InsertSectionSpacer InsertSectionSpacer__spacer">
                  <div class="InsertSectionSpacer__divider">
                    <div class="InsertSectionSpacer__dividerInner"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="itinerarymap">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle1}
            center={center}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={placeClicked}
          >
            <OverlayView
              position={center}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div>
                <span class="MarkerIconWithColor" style={{ fontSize: "2rem" }}>
                  <span class="MarkerIconWithColor__label MarkerIconWithColor__labelLarge">
                    1
                  </span>
                  <span
                    class="MarkerIconWithColor__outlined"
                    style={{
                      color: "rgb(63, 82, 227)",
                      stroke: "#fff",
                      strokeWidth: "40",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="location-pin"
                      class="svg-inline--fa  svg-inline--fa-icon fa-location-pin fa-w-12 "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"
                      ></path>
                    </svg>
                  </span>
                </span>
              </div>
            </OverlayView>
          </GoogleMap>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

// function CustomOverlay({ position, map }) {
//   const overlayRef = useRef(null);

//   useEffect(() => {
//     const overlayView = new window.google.maps.OverlayView();

//     overlayView.onAdd = () => {
//       const div = overlayRef.current;
//       const projection = overlayView.getProjection();

//       if (projection) {
//         const point = projection.fromLatLngToDivPixel(position);

//         if (point) {
//           div.style.position = "absolute";
//           div.style.left = `${point.x}px`; // Set left position
//           div.style.top = `${point.y}px`; // Set top position
//         }
//       }

//       const panes = overlayView.getPanes();
//       panes.overlayLayer.appendChild(div);
//     };

//     overlayView.draw = () => {};

//     overlayView.setMap(window.google.maps.Map);

//     return () => {
//       overlayView.setMap(null);
//     };
//   }, [position]);

//   return (
//     <div ref={overlayRef}>
//       {/* Your custom HTML content here */}
//       <div style={{ backgroundColor: "rgba(255, 0, 0, 0.5)", padding: "10px" }}>
//         Custom Overlay at Position: {position.lat}, {position.lng}
//       </div>
//     </div>
//   );
// }
export default ItineraryCreation;
