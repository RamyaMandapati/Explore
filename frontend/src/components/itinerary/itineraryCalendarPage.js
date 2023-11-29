import React, { useState, useEffect, useRef } from "react";

import "./itineraryCalendar.css";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getItineraryDetails } from "../../actions/itinerary";
import LoadingScreen from "react-loading-screen";
import loading from "../../images/loading.gif";
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";
import { ITINERARY_DETAIL } from "../../actions/types";
import ItineraryInterests from "./itineraryInterests";

export const ItineraryCalendarPage = ({ history }) => {
  const dispatch = useDispatch();
  let { itineraryId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [locationImage, setLocationImage] = useState(
    "https://res.cloudinary.com/dylqg3itm/image/upload/v1701137748/explore/wp5553545-afternoon-venice-grand-canal-wallpapers_ghqvns.jpg"
  );
  const { user } = useSelector((state) => state.auth);

  const [placeImages, setPlaceImages] = useState({});
  // const [profileImage, setProfileImage] = useState(
  //   "https://res.cloudinary.com/dylqg3itm/image/upload/v1701137748/explore/wp5553545-afternoon-venice-grand-canal-wallpapers_ghqvns.jpg"
  // );
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
      if (itineraryData) {
        for (const day of itineraryData) {
          for (const place of day.places) {
            const imageURL = await fetchImageForPlace(place.placeName);
            images[place.placeName] = imageURL
              ? imageURL
              : "https://res.cloudinary.com/dylqg3itm/image/upload/v1701137748/explore/wp5553545-afternoon-venice-grand-canal-wallpapers_ghqvns.jpg";
          }
        }

        setPlaceImages(images);
      }
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
  const contentRef = useRef(null);

  const downloadItinerary = async (e) => {
    e.preventDefault();
    try {
      const content = contentRef.current;

      if (!content) {
        console.error("Content not found");
        return;
      }

      setLoading(true);

      const canvas = await html2canvas(content, {
        scrollY: -window.scrollY,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("portrait", "pt", "a3");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${itinerarydet && itinerarydet.itineraryName}.pdf`);

      setLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false);
    }
  };
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const colors = [
    "#e9f5ff",
    "#cde6dd",
    "#F2EFFF",
    "#FFEBD8",
    "#FDF4F5",
    "#FAEAB1",
    "#E4D8DC",
  ];

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
    const hours = timeTo24HourFormat(time).split(":").map(Number)[0];
    return hours + 2; // +2 because the first column is the day name
  };

  const renderedPlaces = new Set();
  // const timeSpanToGridColumns = (startTime, endTime) => {
  //   return timeToGridColumn(endTime) - timeToGridColumn(startTime) + 1;
  // };
  const [rating, setRating] = useState(0);
  const handleStarClick = (starIndex) => {
    // Set the rating to the clicked star index + 1
    setRating(starIndex + 1);
    const data = {
      itineraryId: itineraryId,
      userRating: starIndex + 1,
      userId: user && user._id,
    };
    axios
      .put("/api/itinerary/rating", data)
      .then((response) => {
        if (response.data.success) {
          dispatch(getItineraryDetails(itineraryId));
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const handleLikeButton = () => {
    const data = {
      itineraryId: itineraryId,
      userId: user && user._id,
    };
    axios
      .put("/api/itinerary/like", data)
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: ITINERARY_DETAIL,
            payload: response.data.itinerary,
          });
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const handleRequest = () => {
    const data = {
      itineraryId: itineraryId,
      memberId: user && user._id,
    };
    axios
      .put("/api/itinerary/requestmember", data)
      .then((response) => {
        if (response.data.success) {
          dispatch(getItineraryDetails(itineraryId));
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };
  const handledisLikeButton = () => {
    const data = {
      itineraryId: itineraryId,
      userId: user && user._id,
    };
    axios
      .put("/api/itinerary/dislike", data)
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: ITINERARY_DETAIL,
            payload: response.data.itinerary,
          });
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
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
  let tempDate = moment(itinerarydet && itinerarydet.startDate);
  const startDate = moment(itinerarydet && itinerarydet.startDate);
  const endDate = moment(itinerarydet && itinerarydet.endDate);
  const tripStartDate = moment(itinerarydet && itinerarydet.startDate).format(
    "MMM D,YYYY"
  );
  const tripEndDate = moment(itinerarydet && itinerarydet.endDate).format(
    "MMM D,YYYY"
  );
  const dateArray = [];
  if (startDate && endDate) {
    while (tempDate <= endDate) {
      dateArray.push({
        day: tempDate.format("dddd"),
        date: tempDate.format("MMMM Do"),
      });
      tempDate.add(1, "days"); // Move to the next day
    }
    if (!startDate.isSame(endDate)) {
      dateArray.push({
        day: endDate.format("dddd"),
        date: endDate.format("MMMM Do"),
      });
    }
  }

  console.log("date", dateArray);
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

  // async function getProfileImage() {
  //   const url = `https://pixabay.com/api/?key=40271680-2ccb695ef668215fefa858c10&q=man profile&image_type=photo&per_page=10&safesearch=True&category=people&editors_choice=True`;
  //   const res = await axios.get(url);
  //   if (res.data.hits && res.data.hits.length > 0) {
  //     const ind = Math.floor(Math.random() * res.data.hits.length);
  //     setProfileImage(res.data.hits[ind].webformatURL);
  //   } else {
  //     console.error("No images returned from Pixabay");
  //   }
  // }

  const editItinerary = () => {
    history.push(`/itineraryedit/${itineraryId}`);
  };
  useEffect(() => {
    if (itinerarydet && itinerarydet.imageUrl) {
      setLocationImage(itinerarydet.imageUrl);
    } else {
      getImage();
    }
    // getProfileImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerarydet]);
  const maxStars = 5;
  let fullStars = 0;
  fullStars = Math.floor(itinerarydet && itinerarydet.itineraryAvgRating);
  let hasHalfStar = false;
  hasHalfStar =
    itinerarydet && itinerarydet.itineraryAvgRating - fullStars >= 0.5;

  const [isHovered, setIsHovered] = useState(false);

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
        <div className="itinerary-page-container" id="report" ref={contentRef}>
          <div className="image" style={containerStyle}>
            <button
              onClick={downloadItinerary}
              aria-label="download"
              className="btn btn-d"
            >
              <DownloadIcon style={{ color: "#f75940" }} />
            </button>
            {itinerarydet &&
              itinerarydet.createdBy._id === (user && user._id) && (
                <button className="btn btn-d btn-e" onClick={editItinerary}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="pencil"
                    class="svg-inline--fa"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    style={{ color: "#f75940" }}
                  >
                    <path
                      fill="currentColor"
                      d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                    ></path>
                  </svg>
                </button>
              )}
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
              <div
                className="add-flex mb-2"
                style={{ display: "flex", alignItems: "center" }}
              >
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

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {itinerarydet &&
                    itinerarydet.itineraryAvgRating >= 0 &&
                    [...Array(fullStars)].map((_, index) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-star-fill w-6 h-6 star-icon "
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                    ))}
                  {itinerarydet &&
                    itinerarydet.itineraryAvgRating >= 0 &&
                    hasHalfStar && (
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="w-6 h-6 star-icon"
                        viewBox="0 0 16 16"
                      >
                        <defs>
                          <linearGradient id="half_grad">
                            <stop offset="50%" stop-color="#f75940" />
                            <stop
                              offset="50%"
                              stop-color="white"
                              stop-opacity="1"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                          fill="url(#half_grad)"
                          // stroke-width="1"
                          stroke="#f75940"
                        />
                      </svg>
                    )}
                  {itinerarydet &&
                    itinerarydet.itineraryAvgRating >= 0 &&
                    [
                      ...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0)),
                    ].map((_, index) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-star-fill w-6 h-6 star-icon-white"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                    ))}
                </div>
                <span className="ml-3">
                  {itinerarydet && itinerarydet.itineraryRating.totalcount}{" "}
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
                <span
                  style={{ color: "#f75940" }}
                  className="a-tag"
                  onClick={() =>
                    history.push(
                      `/profile/${
                        itinerarydet &&
                        itinerarydet.createdBy &&
                        itinerarydet.createdBy._id
                      }`
                    )
                  }
                >
                  {itinerarydet &&
                    itinerarydet.createdBy &&
                    itinerarydet.createdBy.userName}
                </span>
              </h2>
              <div className="add-flex">
                <div
                  className="add-flex"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {itinerarydet &&
                    // Combine members and nonmembers arrays and slice the first two for displaying images
                    [...itinerarydet.members, ...itinerarydet.nonmembers]
                      .slice(0, 2)
                      .map((member, index) => (
                        <img
                          key={index}
                          src={
                            member.profilePhoto ||
                            "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
                          } // Use default image if profilePhoto is not available
                          alt="profileimage"
                          style={{
                            borderRadius: "50%",
                            marginRight:
                              itinerarydet.members.length +
                                itinerarydet.nonmembers.length >
                              1
                                ? "-1.3rem"
                                : "0",
                          }}
                          className="customer-image"
                        />
                      ))}

                  {itinerarydet &&
                    itinerarydet.members.length +
                      itinerarydet.nonmembers.length >
                      2 && (
                      <div className="user-count">
                        +
                        {itinerarydet.members.length +
                          itinerarydet.nonmembers.length -
                          2}
                      </div>
                    )}
                  {isHovered && (
                    <div className="user-details-popup">
                      <h3 style={{ textAlign: "center", color: "#f75940" }}>
                        Members
                      </h3>
                      {itinerarydet &&
                        itinerarydet.members.map((member, index) => (
                          <div key={index} className="user-detail">
                            <img
                              src={
                                member.profilePhoto ||
                                "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
                              }
                              style={{
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                              }}
                              alt="profileimage"
                            />
                            <div
                              className="a-tag"
                              onClick={() =>
                                history.push(`/profile/${member._id}`)
                              }
                            >
                              {member.userName}
                            </div>
                          </div>
                        ))}
                      {itinerarydet && itinerarydet.nonmembers.length !== 0 && (
                        <>
                          <h3
                            style={{
                              textAlign: "center",
                              color: "#f75940",
                              marginTop: "20px",
                            }}
                          >
                            Non Members
                          </h3>
                          <>
                            {itinerarydet &&
                              itinerarydet.nonmembers.map((member, index) => (
                                <div key={index} className="user-detail">
                                  <img
                                    src="https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
                                    style={{
                                      borderRadius: "50%",
                                      width: "50px",
                                      height: "50px",
                                    }}
                                    alt="profileimage"
                                  />
                                  <p style={{ fontWeight: 700 }}>{member}</p>
                                </div>
                              ))}
                          </>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {itinerarydet &&
                  itinerarydet.createdBy._id !== (user && user._id) &&
                  !itinerarydet.userRated && (
                    <div className="add-flex ml-4">
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
                        Rate Trip
                      </span>
                    </div>
                  )}
              </div>
            </div>
            {itinerarydet &&
              itinerarydet.createdBy._id !== (user && user._id) && (
                <div className="add-flex" style={{ gap: "20px" }}>
                  {!itinerarydet.member && (
                    <button
                      className="planbutton planbutton2"
                      onClick={handleRequest}
                      disabled={itinerarydet.request}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {itinerarydet.request ? "Requested" : "Join"}
                    </button>
                  )}
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={
                      itinerarydet && itinerarydet.userLike
                        ? handledisLikeButton
                        : handleLikeButton
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class={
                        itinerarydet && itinerarydet.userLike
                          ? "w-6 h-6 height-icon star-icon fill-color"
                          : "w-6 h-6 height-icon star-icon-color fill-color"
                      }
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </div>
                </div>
              )}
          </div>
          <div className="Interests">
            <ItineraryInterests
              interests={itinerarydet && itinerarydet.interests}
            />
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
                      <p>
                        {dateArray.length !== 0 &&
                          dateArray[index] &&
                          dateArray[index].day}
                      </p>
                      <p style={{ color: "#f75940" }}>
                        {dateArray.length !== 0 &&
                          dateArray[index] &&
                          dateArray[index].date}
                      </p>
                    </div>
                  </div>
                  {hours.map((hour) => {
                    const placeForHour =
                      day &&
                      day.places.find((place) =>
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
                      const cardBackgroundColor = colors[index % colors.length];
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
