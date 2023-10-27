import React, { useState, useEffect } from "react";

import "./itineraryCalendar.css";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getItineraryDetails } from "../../actions/itinerary";
import LoadingScreen from "react-loading-screen";
import loading from "../../images/loading.gif";
import moment from "moment";
import axios from "axios";

export const ItineraryCalendarPage = ({ history }) => {
  const dispatch = useDispatch();
  let { itineraryId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [locationImage, setLocationImage] = useState(
    "https://media.timeout.com/images/105770969/1372/772/image.jpg"
  );

  const [placeImages, setPlaceImages] = useState({});
  const [profileImage, setProfileImage] = useState(
    "https://media.timeout.com/images/105770969/1372/772/image.jpg"
  );
  const itinerarydet = useSelector((state) => state.itinerary.itinerarydet);
  const itineraryData = itinerarydet && itinerarydet.itineraryList;

  async function fetchImageForPlace(placeName) {
    const url = `https://pixabay.com/api/?key=40271680-2ccb695ef668215fefa858c10&q=${encodeURIComponent(
      placeName
    )}&image_type=photo&per_page=10&safesearch=True&category=places&editors_choice=True&minwidth=640&minheight=500`;

    const res = await axios.get(url);
    if (res.data.hits.length > 0) {
      const ind = Math.floor(Math.random() * res.data.hits.length);

      return res.data.hits[ind].webformatURL;
    }
    return null;
  }

  useEffect(() => {
    async function fetchAllImages() {
      const images = {};
      const itineraryData = itinerarydet && itinerarydet.itineraryList;
      for (const day of itineraryData) {
        for (const place of day.places) {
          const imageURL = await fetchImageForPlace(place.placeName);
          images[place.placeName] = imageURL
            ? imageURL
            : "https://media.timeout.com/images/105770969/1372/772/image.jpg";
        }
      }

      setPlaceImages(images);
    }
    fetchAllImages();
  }, [itinerarydet]);

  useEffect(() => {
    if (itineraryId) {
      setLoading(true);
      dispatch(getItineraryDetails(itineraryId)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, itineraryId]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const colors = ["#e9f5ff", "#cde6dd", "#F2EFFF", "#f5e7c4"];

  const isHourWithinPlaceTimeRange = (hour, startTime, endTime) => {
    const startHour = parseInt(timeTo24HourFormat(startTime).split(":")[0], 10);
    const endHour = parseInt(timeTo24HourFormat(endTime).split(":")[0], 10);

    const val = hour >= startHour && hour < endHour;
    return val;
  };
  const timeTo24HourFormat = (time) => {
    const [hours, minutesAndPeriod] = time.split(":");
    const [minutes, period] = minutesAndPeriod.split(" ");

    let hoursIn24Format = parseInt(hours, 10);
    if (period.toLowerCase() === "pm" && hours !== "12") {
      hoursIn24Format += 12;
    } else if (period.toLowerCase() === "am" && hours === "12") {
      hoursIn24Format = 0;
    }

    return `${hoursIn24Format}:${minutes}`;
  };

  const timeToGridColumn = (time) => {
    const [hours, minutes] = timeTo24HourFormat(time).split(":").map(Number);
    return hours + 2; // +2 because the first column is the day name
  };

  const renderedPlaces = new Set();
  const timeSpanToGridColumns = (startTime, endTime) => {
    return timeToGridColumn(endTime) - timeToGridColumn(startTime) + 1;
  };
  const [rating, setRating] = useState(0);
  const handleStarClick = (starIndex) => {
    // Set the rating to the clicked star index + 1
    setRating(starIndex + 1);
  };

  const containerStyle = {
    backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ), url(${locationImage})`, // Set the dynamic image URL
    backgroundSize: "cover", // Adjust as needed
    backgroundRepeat: "no-repeat", // Adjust as needed
    width: "100%", // Set dimensions and other styles
    height: "260px",
    position: "relative",
    borderRadius: "8px 8px 0 0",
  };
  const startDate = moment(itinerarydet && itinerarydet.startDate);
  const endDate = moment(itinerarydet && itinerarydet.endDate);
  const tripStartDate = moment(itinerarydet && itinerarydet.startDate).format(
    "MMM D,YYYY"
  );
  const tripEndDate = moment(itinerarydet && itinerarydet.endDate).format(
    "MMM D,YYYY"
  );
  const dateArray = [];

  while (startDate < endDate) {
    dateArray.push({
      day: startDate.format("dddd"),
      date: startDate.format("MMMM Do"),
    });
    startDate.add(1, "days"); // Move to the next day
  }
  if (!startDate.isSame(endDate)) {
    dateArray.push({
      day: endDate.format("dddd"),
      date: endDate.format("MMMM Do"),
    });
  }

  async function getImage() {
    const location = itinerarydet && itinerarydet.destination;
    const url = `https://pixabay.com/api/?key=40271680-2ccb695ef668215fefa858c10&q=${location}&image_type=photo&per_page=10&safesearch=True&category=places&editors_choice=True`;
    const res = await axios.get(url);
    if (res.data.hits && res.data.hits.length > 0) {
      const ind = Math.floor(Math.random() * res.data.hits.length);
      setLocationImage(res.data.hits[ind].webformatURL);
    } else {
      console.error("No images returned from Pixabay");
    }
  }

  async function getProfileImage() {
    const url = `https://pixabay.com/api/?key=40271680-2ccb695ef668215fefa858c10&q=man profile&image_type=photo&per_page=10&safesearch=True&category=people&editors_choice=True`;
    const res = await axios.get(url);
    if (res.data.hits && res.data.hits.length > 0) {
      const ind = Math.floor(Math.random() * res.data.hits.length);
      setProfileImage(res.data.hits[ind].webformatURL);
    } else {
      console.error("No images returned from Pixabay");
    }
  }

  useEffect(() => {
    getImage();
    getProfileImage();
  }, [itinerarydet]);

  return (
    <>
      <div>
        <LoadingScreen
          loading={isLoading}
          bgColor="#f1f1f1"
          textColor="#676767"
          logoSrc={loading}
          text="Loading your Itinerary!"
        />
        <div className="itinerary-page-container">
          <div className="image" style={containerStyle}>
            <div className="itinerary-info">
              <p
                style={{
                  fontSize: "32px",
                }}
                className="mb-1"
              >
                {itinerarydet && itinerarydet.destination}{" "}
                {dateArray && dateArray.length} day Trip Plan
              </p>
              <div className="add-flex mb-2">
                <button className="planbutton planbutton3">
                  verified trip plan
                </button>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="calendar-days"
                  class="svg-inline--fa fa-w-14 fa-fw ml-3"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"
                  ></path>
                </svg>
                <span className="ml-2">
                  {tripStartDate} - {tripEndDate}
                </span>
              </div>

              <div className="add-flex">
                <div className="add-flex">
                  {Array(4)
                    .fill()
                    .map((_, index) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 star-icon-color"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    ))}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 star-icon-color"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <span className="ml-3">
                  {itinerarydet && itinerarydet.itineraryRating.totalrating}{" "}
                  ratings
                </span>
              </div>
            </div>
          </div>
          <div className="itinerary-rating space-flex">
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                }}
                className="mb-2"
              >
                Trip Created By{" "}
                <span style={{ color: "#f75940" }}>
                  {itinerarydet &&
                    itinerarydet.createdBy &&
                    itinerarydet.createdBy.userName}
                </span>
              </h2>
              <div className="add-flex">
                <img
                  src={profileImage}
                  style={{ height: "52px", width: "52px", borderRadius: "50%" }}
                ></img>
                <div className="add-flex ml-2">
                  {Array(5)
                    .fill()
                    .map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class={
                          index < rating
                            ? "w-6 h-6 star-icon fill-color"
                            : "w-6 h-6 star-icon-color fill-color"
                        }
                        onClick={() => handleStarClick(index)}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    ))}
                  <span
                    className="ml-2"
                    style={{
                      fontSize: "10px",
                      marginTop: "-4px",
                      fontWeight: "700",
                    }}
                  >
                    Rate{" "}
                    {itinerarydet &&
                      itinerarydet.createdBy &&
                      itinerarydet.createdBy.userName}
                  </span>
                </div>
              </div>
            </div>
            <div className="add-flex">
              <button className="planbutton planbutton2">Join</button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 height-icon star-icon-color fill-color ml-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>
          <div className="calendar-container">
            <div className="time-header">
              <div className="hour hour-not"></div>
              {hours.map((hour) => (
                <div key={hour} className="hour">
                  {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "am" : "pm"}
                </div>
              ))}
            </div>
            {itineraryData &&
              itineraryData.map((day, index) => (
                <div key={index} className="day-container">
                  <div className="day-header">
                    <div>
                      <p>{dateArray && dateArray[index].day}</p>
                      <p style={{ color: "#f75940" }}>
                        {dateArray && dateArray[index].date}
                      </p>
                    </div>
                  </div>
                  {hours.map((hour) => {
                    const placeForHour = day.places.find((place) =>
                      isHourWithinPlaceTimeRange(
                        hour,
                        place.startTime,
                        place.endTime
                      )
                    );

                    if (placeForHour && !renderedPlaces.has(placeForHour._id)) {
                      renderedPlaces.add(placeForHour._id);
                      const gridColumnStart = timeToGridColumn(
                        placeForHour.startTime
                      );
                      const gridColumnEnd = timeToGridColumn(
                        placeForHour.endTime
                      );
                      const cardBackgroundColor = colors[index];
                      return (
                        <div
                          key={hour}
                          className="place-card"
                          style={{
                            gridColumnStart: gridColumnStart,
                            gridColumnEnd: gridColumnEnd,
                            backgroundColor: cardBackgroundColor,
                          }}
                        >
                          <div className="card-flex">
                            <img
                              src={placeImages[placeForHour.placeName]}
                              style={{
                                height: "52px",
                                width: "52px",
                                borderRadius: "16px",
                              }}
                              alt={placeForHour.placeName}
                            ></img>
                            <div className="column-flex">
                              <span style={{ color: "#f75940" }}>
                                {placeForHour.placeName}
                              </span>
                              <span>{placeForHour.category}</span>
                            </div>
                          </div>
                          <div className="cost-card">
                            <span style={{ color: "#f75940" }}>
                              {placeForHour.cost} $
                            </span>
                          </div>
                        </div>
                      );
                    } else if (!placeForHour) {
                      return <div key={hour} className="hour"></div>;
                    }
                    return null;
                  })}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <FullCalendar plugins={[timeGridPlugin]} initialView={"timeGridWeek"} /> */}
    </>
  );
};

export default ItineraryCalendarPage;
