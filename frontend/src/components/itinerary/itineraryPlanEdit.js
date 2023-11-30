import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  OverlayView,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";

import "./itinerary.css";
import ItineraryTime from "./itineraryTime";
import ItineraryCost from "./itineraryCost";
import LoadingScreen from "react-loading-screen";
import loading from "../../images/loading.gif";
import { useSelector } from "react-redux";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { Modal, Box, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import SearchBox from "./searchBox";
import ItineraryCategory from "./itineraryCategory";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CustomCheckbox, StyledFormControl } from "./CustomComponents";

const libraries = ["drawing", "places", "geometry"];
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: "2px solid ",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

export const ItineraryPlanEdit = ({ history }) => {
  const names = [
    "Hiking",
    "Nightlife",
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
    "Transgender",
    "Male",
    "Female",
    "Baby-friendly",
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const Error = styled.span`
    color: red;
  `;
  let { itineraryId } = useParams();

  const [map, setMap] = React.useState(null);

  const [itinerary, setItinerary] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [members, setMembers] = useState([]);
  const [nonmembers, setNonMembers] = useState([]);
  const [budget, setBudget] = useState("");
  const [destination, setDestination] = useState("");
  const [itineraryOwner, setItineraryOwner] = useState("");
  // const [createdBy, setCreatedBy] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [nonmembersList, setNonMembersList] = useState([]);

  const [interests, setInterests] = useState([]);
  const [startdayjsDate, setStartDayjsDate] = useState();
  const [enddayjsDate, setEndDayjsDate] = useState();
  const [imageUrl, setImageUrl] = useState();

  let dateArray = [];
  let tripStartDate = "";
  let tripEndDate = "";
  if (startDate && endDate) {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(endDate);
    tripStartDate = momentStartDate.format("MM/DD");
    tripEndDate = momentEndDate.format("MM/DD");
    let tempDate = moment(momentStartDate);

    if (momentStartDate.isSame(momentEndDate)) {
      dateArray.push(
        momentEndDate.format("dddd") + ", " + momentEndDate.format("MMMM Do")
      );
    } else {
      while (tempDate <= momentEndDate) {
        dateArray.push(
          tempDate.format("dddd") + ", " + tempDate.format("MMMM Do")
        );
        tempDate.add(1, "days"); // Move to the next day
      }
    }
    // while (true) {
    //   dateArray.push(
    //     tempDate.format("dddd") + ", " + tempDate.format("MMMM Do")
    //   );
    //   if (tempDate.isSame(endDate)) {
    //     break; // Exit the loop if tempDate is the same as endDate
    //   }
    //   tempDate.add(1, "days");
    // }
  }

  const [tripName, setTripName] = React.useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAUmGqs6vCSNoKHWwvYfifpkOJ5lZLrUBo",
    libraries,
  });

  const [buttonStates, setButtonStates] = useState(
    Array(dateArray.length).fill(false)
  );

  // const [searchLocations, setSearchLocations] = useState(
  //   dateArray.map(() => "")
  // );
  const toggleButton = (index) => {
    const updatedButtonStates = [...buttonStates];
    updatedButtonStates[index] = !updatedButtonStates[index];
    setButtonStates(updatedButtonStates);
  };
  const colors = [
    "rgb(63, 82, 227)",
    "rgb(247, 89, 64)",
    "rgb(23, 185, 120)",
    "rgb(236, 155, 59)",
    "rgb(44, 54, 93)",
    "rgb(70, 205, 207)",
    "rgb(112, 69, 175)",
    "rgb(52, 152, 219)",
  ];
  const [zoom, setZoom] = useState(6);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCost, setSelectedCost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errorDate, setDateError] = useState(false);

  const handleAddTime = (dateIndex, placeIndex) => {
    setSelectedTime({ dateIndex, placeIndex });
  };

  const handleAddCost = (dateIndex, placeIndex) => {
    setSelectedCost({ dateIndex, placeIndex });
  };

  const handleAddCategory = (dateIndex, placeIndex) => {
    setSelectedCategory({ dateIndex, placeIndex });
  };

  const updateItineraryTime = (dateIndex, placeIndex, startTime, endTime) => {
    const updatedItinerary = [...itinerary];

    // Update the start and end times for the specified place
    updatedItinerary[dateIndex].places[placeIndex].startTime = startTime;
    updatedItinerary[dateIndex].places[placeIndex].endTime = endTime;

    // Set the updated itinerary
    setItinerary(updatedItinerary);
    setSelectedTime(null);
  };

  const updateItineraryCategory = (dateIndex, placeIndex, category) => {
    const updatedItinerary = [...itinerary];

    // Update the start and end times for the specified place
    updatedItinerary[dateIndex].places[placeIndex].category = category;

    // Set the updated itinerary
    setItinerary(updatedItinerary);
    setSelectedCategory(null);
  };

  const [openBoxIndices, setOpenBoxIndices] = useState({
    dateIndex: null,
    placeIndex: null,
  });

  const [openSearchBoxIndices, setOpenSearchBoxIndices] = useState({
    dateIndex: null,
    placeIndex: null,
  });
  const toggleBoxVisibility = (dateIndex, placeIndex) => {
    setOpenBoxIndices({ dateIndex, placeIndex });
  };
  const toggleSearchBoxVisibility = (dateIndex, placeIndex) => {
    setOpenSearchBoxIndices({ dateIndex, placeIndex });
  };
  const updateItineraryCost = (dateIndex, placeIndex, cost) => {
    const updatedItinerary = [...itinerary];

    // Update the start and end times for the specified place
    updatedItinerary[dateIndex].places[placeIndex].cost = cost;

    // Set the updated itinerary
    setItinerary(updatedItinerary);
    setSelectedCost(null);
  };

  const [isLoading, setLoading] = useState(false);
  const [startingLocation, setStartingLocation] = useState("");
  const validateItineraryTimes = (itinerary) => {
    for (let index = 0; index < itinerary.length; index++) {
      const day = itinerary[index];
      if (day?.places) {
        for (let placeIndex = 0; placeIndex < day.places.length; placeIndex++) {
          const place = day.places[placeIndex];
          if (!place.startTime || !place.endTime) {
            // If any place is missing time, return false
            return false;
          }
        }
      }
    }
    // All places have start and end time
    return true;
  };

  useEffect(() => {
    let responseData;
    const getItinerary = async () => {
      try {
        const response = await fetch(`/api/itinerary/${itineraryId}`, {
          method: "GET",
        });
        responseData = await response.json();
        setItinerary(responseData.itinerary.itineraryList);
        setTripName(responseData.itinerary.itineraryName);
        setStartDate(responseData.itinerary.startDate);
        setEndDate(responseData.itinerary.endDate);
        setBudget(responseData.itinerary.budget);
        setInterests(responseData.itinerary.interests);
        setDestination(responseData.itinerary.destination);
        setItineraryOwner(responseData.itinerary.createdBy.email);
        // setCreatedBy(responseData.itinerary.createdBy.username);
        setMemberList(responseData.itinerary.members);
        setNonMembersList(responseData.itinerary.nonmembers);
        setMembers(responseData.itinerary.members.map((member) => member._id));
        setNonMembers(responseData.itinerary.nonmembers);
        setStartingLocation(responseData.itinerary.startingLocation);
        setImageUrl(responseData.itinerary.imageUrl);
        const place = responseData.itinerary.itineraryList[0].Places[0];
        map.setCenter({ lat: place.Latitude, lng: place.Longitude });
      } catch (err) {
        console.log(err);
      }
    };
    if (itineraryId) {
      getItinerary();
    }
    console.log("api", responseData);
  }, []);

  useEffect(() => {
    if (startDate) {
      setStartDayjsDate(dayjs(startDate));
    }
    if (endDate) {
      setEndDayjsDate(dayjs(endDate));
    }
  }, [startDate, endDate]);

  const onSubmit = () => {
    if (!validateItineraryTimes(itinerary)) {
      alert("Please fill in the time for each place in your itinerary.");
      return; // Prevent submission
    } else {
      const data = {
        itineraryId: itineraryId,
        itineraryName: tripName,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        budget: budget,
        itineraryList: itinerary,
        interests: interests,
        userId: user && user._id,
        members: members,
        nonmembers: nonmembers,
        startingLocation: startingLocation,
        imageUrl: imageUrl,
      };
      axios
        .post("/api/itinerary", data)
        .then((response) => {
          if (response.data.success) {
            history.push(`/itinerary/${itineraryId}`);
          }
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  };

  const containerStyle1 = {
    width: "460px",
    height: "100vh",
  };

  const center = {
    lat: 37,
    lng: -122,
  };

  useEffect(() => {
    if (!map) return;

    if (markerPositions && markerPositions.length > 0) {
      // If there are marker positions, fit the map bounds to include all markers
      const bounds = new window.google.maps.LatLngBounds();
      markerPositions.forEach((position) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
      // map.setZoom(12);
    } else {
      // If no marker positions, set the center and zoom to your default values
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, markerPositions, center, zoom]);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    map.setZoom(zoom);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // const onSBLoad = (ref) => {
  //   setSearchBox(ref);
  // };

  const handleRemovePlace = (dateIndex, placeIndex) => {
    // Create a copy of the current itinerary
    const updatedItinerary = [...itinerary];

    // Remove the specified place from the itinerary
    updatedItinerary[dateIndex].places.splice(placeIndex, 1);

    // Update the state with the modified itinerary
    setItinerary(updatedItinerary);
  };

  const onPlacesChanged = async (place, dateIndex) => {
    const placeName = place.name;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const selectedLocation = {
      placeName: placeName,
      lat: lat,
      lng: lng,
      startTime: "",
      endTime: "",
      cost: "",
      description: "",
      category: "",
    };
    // await setSearchLocations((prevSearchLocations) => {
    //   const updatedSearchValues = [...prevSearchLocations];
    //   updatedSearchValues[dateIndex] = "";
    //   return updatedSearchValues;
    // });
    await handleSelectedLocation(selectedLocation, dateIndex);
  };

  const [addMember, setAddMember] = React.useState(false);
  const handleAddMemberOpen = () => setAddMember(true);
  const handleAddMemberClose = () => setAddMember(false);
  const handleMember = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/group/editmember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itineraryId: itineraryId,
          userId: user && user._id,
          members,
        }),
      }).then(history.push(`/itinerary/${itineraryId}`));
      handleAddMemberClose();
    } catch (e) {
      console.log(e);
    }
  };

  const [editItinerary, setEditItinerary] = React.useState(false);
  const handleEditItineraryOpen = () => setEditItinerary(true);
  const handleEditItineraryClose = () => setEditItinerary(false);
  const handleEditItinerary = async (e) => {
    e.preventDefault();
    handleEditItineraryClose();
  };

  const handleSelectedLocation = async (
    selectedLocation,
    dateIndexToAddLocation
  ) => {
    setItinerary((prevItinerary) => {
      const updatedItinerary = [...prevItinerary];
      let newPlaceIndex = 0;

      if (!updatedItinerary[dateIndexToAddLocation]) {
        updatedItinerary[dateIndexToAddLocation] = {
          day: dateIndexToAddLocation + 1,
          places: [selectedLocation],
        };
        newPlaceIndex = 0;
      } else {
        newPlaceIndex = updatedItinerary[dateIndexToAddLocation].places.length;

        updatedItinerary[dateIndexToAddLocation] = {
          ...updatedItinerary[dateIndexToAddLocation],
          places: [
            ...updatedItinerary[dateIndexToAddLocation].places,
            selectedLocation,
          ],
        };
      }
      toggleBoxVisibility(dateIndexToAddLocation, newPlaceIndex);

      return updatedItinerary;
    });
    console.log("openbox", openBoxIndices);
    // const positions = calculateMarkerPositions(itinerary);
    // setMarkerPositions(positions);
  };

  function calculateMarkerPositions(itineraryData) {
    const positions = [];
    if (itineraryData && map) {
      itineraryData.forEach((day) => {
        day.places.forEach((place) => {
          if (place.lat && place.lng) {
            positions.push(new window.google.maps.LatLng(place.lat, place.lng));
          }
        });
      });
    }

    return positions;
  }

  useEffect(() => {
    if (itinerary) {
      const positions = calculateMarkerPositions(itinerary);
      setMarkerPositions(positions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const updateSelectedLocation = async (place, dateIndex, placeIndex) => {
    setItinerary((prevItinerary) => {
      const updatedItinerary = [...prevItinerary];
      updatedItinerary[dateIndex].places[placeIndex].placeName = place.name;
      updatedItinerary[dateIndex].places[placeIndex].lat =
        place.geometry.location.lat();
      updatedItinerary[0].places[placeIndex].lng =
        place.geometry.location.lng();
      return updatedItinerary;
    });
    setOpenSearchBoxIndices({ dateIndex: null, placeIndex: null });
    // const positions = await calculateMarkerPositions(itinerary);
    // setMarkerPositions(positions);
  };

  const containerStyle = {
    backgroundImage: `linear-gradient(180deg,rgba(33,37,41,.5) 0,transparent 50%), url(${imageUrl})`, // Set the dynamic image URL
    backgroundSize: "cover", // Adjust as needed
    backgroundRepeat: "no-repeat", // Adjust as needed
    // Add other styles as needed
    width: "100%", // Set dimensions and other styles
    height: "240px",
    position: "relative",
  };
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "thrryyss");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dylqg3itm/image/upload",
        formData
      );
      setImageUrl(response.data.secure_url);
    }
  };

  const openFileInput = () => {
    // Trigger a click event on the hidden file input
    document.getElementById("fileInput").click();
  };

  const handleDescChange = (itineraryIndex, placeIndex, newValue) => {
    const updatedItinerary = [...itinerary];

    updatedItinerary[itineraryIndex].places[placeIndex].description = newValue;

    setItinerary(updatedItinerary);
  };

  return (
    <div>
      <LoadingScreen
        loading={isLoading}
        bgColor="#f1f1f1"
        textColor="#676767"
        logoSrc={loading}
        text="Loading your Itinerary!"
      />
      <div className="itinerarycreation">
        <div className="itineraryplan">
          <div className="itineraryimage">
            <div
              className="image"
              style={containerStyle}
              onClick={openFileInput}
            >
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
              <div className="mt-2 add-flex" style={{ gap: "5px" }}>
                <label style={{ fontWeight: 700, paddingLeft: "5px" }}>
                  Starting Location:
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Enter starting Location"
                    className="input_start"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="date-flex space-flex">
                <button
                  type="button"
                  className="btn-date btn-date1"
                  onClick={handleEditItineraryOpen}
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
                <Modal
                  open={editItinerary}
                  onClose={handleEditItineraryClose}
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Form>
                      <label className="edit__label">Edit Itinerary</label>

                      <>
                        <div className="itinerarybox1">
                          <Stack direction="row" spacing={6}>
                            {/* <DatePicker label="Basic date picker" /> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  required
                                  defaultValue={startdayjsDate}
                                  label="Start Date"
                                  onChange={(newValue) => {
                                    setStartDate(newValue.$d);
                                    setItinerary([]);
                                  }}
                                  sx={{
                                    "& .MuiInputLabel-root.Mui-focused": {
                                      color: "#aeb6f3",
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused": {
                                      "& > fieldset": {
                                        borderColor: "#aeb6f3",
                                      },
                                    },
                                  }}
                                  // onChange={(e) => setStartDate(e)}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  required
                                  defaultValue={enddayjsDate}
                                  label="End Date"
                                  // onChange={(e) => setEndDate(e)}
                                  onChange={(newValue) => {
                                    setEndDate(newValue.$d);
                                  }}
                                  error={errorDate}
                                  sx={{
                                    "& .MuiInputLabel-root.Mui-focused": {
                                      color: "#aeb6f3",
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused": {
                                      "& > fieldset": {
                                        borderColor: "#aeb6f3",
                                      },
                                    },
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Stack>
                          <div>
                            <StyledFormControl sx={{ mt: 3 }}>
                              <InputLabel>Interests</InputLabel>
                              <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={interests}
                                label="intersts"
                                onChange={handleChange}
                                InputProps={{ sx: { height: 45 } }}
                                input={<OutlinedInput label="Interests" />}
                                renderValue={(selected) => selected.join(", ")}
                                sx={{ width: 540 }}
                                MenuProps={MenuProps}
                              >
                                {names.map((name) => (
                                  <MenuItem key={name} value={name}>
                                    <CustomCheckbox
                                      checked={interests.indexOf(name) > -1}
                                    />
                                    <ListItemText primary={name} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </StyledFormControl>
                          </div>
                          <TextField
                            className="plan__location"
                            id="plan-budget-input"
                            type="text"
                            autoComplete=""
                            label="Budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: 540,
                              mt: 3,
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#aeb6f3",
                              },
                              "& .MuiOutlinedInput-root.Mui-focused": {
                                "& > fieldset": {
                                  borderColor: "#aeb6f3",
                                },
                              },
                            }}
                          />
                          {errorDate ? (
                            <Error>
                              Make sure you enter location, start date and end
                              date{" "}
                            </Error>
                          ) : (
                            <p />
                          )}
                        </div>
                      </>
                      <button
                        onClick={handleEditItinerary}
                        className="planbutton updatebutton"
                      >
                        Update
                      </button>
                    </Form>
                  </Box>
                </Modal>
                <div className="add-flex">
                  <button
                    className="btn btn-2"
                    style={{ backgroundColor: "#dee2e6" }}
                  >
                    I
                  </button>
                  <button className="btn btn-3" onClick={handleAddMemberOpen}>
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
                  <Modal
                    open={addMember}
                    onClose={handleAddMemberClose}
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Form>
                        <label className="edit__label">Manage Members</label>
                        <Autocomplete
                          multiple
                          id="tags-filled"
                          options={[]}
                          freeSolo
                          defaultValue={memberList.map(
                            (member) => member.email
                          )}
                          onChange={async (
                            event,
                            newValue,
                            reason,
                            details
                          ) => {
                            const response = await fetch(`/api/user/email`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ email: details.option }),
                            });
                            if (response.status === 200) {
                              const responseData = await response.json();
                              let finalMemberList;

                              if (reason === "createOption") {
                                finalMemberList = [
                                  ...members,
                                  responseData._id,
                                ];
                              } else if (reason === "removeOption") {
                                finalMemberList = [...members];
                                members.map((mem) => {
                                  if (mem === responseData._id) {
                                    finalMemberList.splice(
                                      finalMemberList.indexOf(mem),
                                      1
                                    );
                                  }
                                });
                              }
                              setMembers(finalMemberList);
                            } else {
                              if (reason === "createOption") {
                                alert(
                                  "Email address not found or an error occurred."
                                );
                              }
                            }
                          }}
                          renderTags={(mems, getTagProps) =>
                            mems.map((option, index) => (
                              <Chip
                                label={option}
                                {...getTagProps({ index })}
                                disabled={
                                  option === itineraryOwner ? true : false
                                }
                                // onDelete={handleDelete(option)}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              label=""
                              placeholder="Enter email address"
                            />
                          )}
                        />
                        <Typography
                          sx={{ marginTop: 2, marginBottom: 2 }}
                          color="text.secondary"
                        >
                          Enter a valid email address and press Enter to add a
                          member.
                        </Typography>

                        <Autocomplete
                          multiple
                          id="tags-filled"
                          options={[]}
                          freeSolo
                          defaultValue={nonmembersList.map((member) => member)}
                          onChange={async (
                            event,
                            newValue,
                            reason,
                            details
                          ) => {
                            const responseData = details.option;
                            let finalMemberList;
                            if (reason === "createOption") {
                              finalMemberList = [...nonmembers, responseData];
                            } else if (reason === "removeOption") {
                              finalMemberList = [...nonmembers];
                              nonmembers.map((mem) => {
                                if (mem === responseData) {
                                  finalMemberList.splice(
                                    finalMemberList.indexOf(mem),
                                    1
                                  );
                                }
                              });
                            }
                            setNonMembers(finalMemberList);
                            console.log(nonmembers);
                          }}
                          renderTags={(mems, getTagProps) =>
                            mems.map((option, index) => (
                              <Chip
                                label={option}
                                {...getTagProps({ index })}
                                // disabled={
                                //   option === itineraryOwner ? true : false
                                // }
                                // onDelete={handleDelete(option)}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              label=""
                              placeholder="Enter non-guests names"
                            />
                          )}
                        />
                        <Typography
                          sx={{ marginTop: 2 }}
                          color="text.secondary"
                        >
                          Add guests names and press Enter to add a member.
                        </Typography>

                        <button
                          onClick={handleMember}
                          className="planbutton updatebutton"
                        >
                          Update
                        </button>
                      </Form>
                    </Box>
                  </Modal>
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
                  onClick={handleEditItineraryOpen}
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
                    <button
                      className="sectionbutton"
                      onClick={() => toggleButton(index)}
                    >
                      {buttonStates[index] ? (
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
                        {buttonStates[index] ? (
                          <span
                            style={{
                              color: "#6c757d",
                              fontWeight: "700",
                            }}
                          >
                            {itinerary &&
                            itinerary[index]?.places &&
                            itinerary[index]?.places.length
                              ? itinerary[index]?.places.length + ` place`
                              : `No places`}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {!buttonStates[index] ? (
                      <div>
                        {itinerary &&
                          itinerary[index]?.places.map((place, placeIndex) => (
                            <>
                              {openSearchBoxIndices.dateIndex === index &&
                              openSearchBoxIndices.placeIndex === placeIndex ? (
                                isLoaded ? (
                                  <SearchBox
                                    onPlacesChange={(place) =>
                                      updateSelectedLocation(
                                        place,
                                        index,
                                        placeIndex
                                      )
                                    }
                                  />
                                ) : (
                                  ""
                                )
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    marginRight: "-40px",
                                  }}
                                >
                                  <div
                                    className="itinerary-plan-box"
                                    onClick={() =>
                                      toggleBoxVisibility(index, placeIndex)
                                    }
                                  >
                                    <div class="BlockLeftIconContainer BlockLeftIconContainer__absolute py-2">
                                      <span
                                        class="MarkerIconWithColor"
                                        style={{ fontSize: "2rem" }}
                                      >
                                        <span class="MarkerIconWithColor__label MarkerIconWithColor__labelLarge">
                                          {placeIndex + 1}
                                        </span>
                                        <span
                                          class="MarkerIconWithColor__outlined"
                                          style={{
                                            color:
                                              colors[index % colors.length],
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
                                        <span>{place.placeName}</span>
                                        {openBoxIndices.dateIndex === index &&
                                          openBoxIndices.placeIndex ===
                                            placeIndex && (
                                            <svg
                                              aria-labelledby="svg-inline--fa-title-lnKUevjzaCSO"
                                              data-prefix="fas"
                                              data-icon="pen"
                                              class="svg-inline--fa svg-inline--fa-medium fa-pen fa-w-16 fa-xs ml-2"
                                              role="img"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 512 512"
                                              onClick={() =>
                                                toggleSearchBoxVisibility(
                                                  index,
                                                  placeIndex
                                                )
                                              }
                                            >
                                              {/* <title id="svg-inline--fa-title-lnKUevjzaCSO">Edit</title> */}
                                              <path
                                                fill="currentColor"
                                                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                                              ></path>
                                            </svg>
                                          )}
                                      </button>

                                      <div className="mb-2 input_item_plan">
                                        {(openBoxIndices.dateIndex === index &&
                                          openBoxIndices.placeIndex ===
                                            placeIndex) ||
                                        place.description !== "" ? (
                                          <input
                                            type="text"
                                            value={place.description}
                                            className="desc_input_plan"
                                            placeholder="Add description here"
                                            onChange={(e) => {
                                              const newValue = e.target.value;
                                              handleDescChange(
                                                index,
                                                placeIndex,
                                                newValue
                                              );
                                            }}
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      {(openBoxIndices.dateIndex === index &&
                                        openBoxIndices.placeIndex ===
                                          placeIndex) ||
                                      place.startTime !== "" ||
                                      place.cost !== "" ||
                                      place.category !== "" ? (
                                        <div className="add-flex mb-2">
                                          {/* {((openBoxIndices.dateIndex ===
                                            index &&
                                            openBoxIndices.placeIndex ===
                                              placeIndex) ||
                                            place.startTime !== "") && ( */}
                                          <div
                                            className={
                                              place.startTime === "" ||
                                              place.cost === ""
                                                ? "mt-n3 mb-n2"
                                                : ""
                                            }
                                          >
                                            <button
                                              type="button"
                                              className={
                                                place.startTime === ""
                                                  ? "btn-date btn-date1"
                                                  : "btn-date btn-date1 btn-time-cost"
                                              }
                                              style={{
                                                position: "relative",
                                              }}
                                              onClick={() =>
                                                handleAddTime(index, placeIndex)
                                              }
                                            >
                                              {place.startTime === "" ? (
                                                openBoxIndices.dateIndex ===
                                                  index &&
                                                openBoxIndices.placeIndex ===
                                                  placeIndex && (
                                                  <>
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
                                                    <span className="ml-2">
                                                      Add time
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                <span
                                                  style={{
                                                    padding: "0 8px",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {place.startTime} to{" "}
                                                  {place.endTime}
                                                </span>
                                              )}
                                            </button>
                                            {selectedTime &&
                                              selectedTime.dateIndex ===
                                                index &&
                                              selectedTime.placeIndex ===
                                                placeIndex && (
                                                <ItineraryTime
                                                  onSave={(
                                                    startTime,
                                                    endTime
                                                  ) =>
                                                    updateItineraryTime(
                                                      index,
                                                      placeIndex,
                                                      startTime,
                                                      endTime
                                                    )
                                                  }
                                                  onCancel={() =>
                                                    setSelectedTime(null)
                                                  }
                                                  initialStartTime={
                                                    place.startTime
                                                  }
                                                  initialEndTime={place.endTime}
                                                />
                                              )}
                                          </div>
                                          {/* )} */}
                                          <div
                                            className={
                                              place.startTime === "" ||
                                              place.cost === ""
                                                ? "mt-n3 mb-n2 ml-2"
                                                : "ml-2"
                                            }
                                          >
                                            <button
                                              type="button"
                                              className={
                                                place.cost === ""
                                                  ? "btn-date btn-date1"
                                                  : "btn-date btn-date1 btn-time-cost"
                                              }
                                              style={{
                                                position: "relative",
                                              }}
                                              onClick={() =>
                                                handleAddCost(index, placeIndex)
                                              }
                                            >
                                              {place.cost === "" ? (
                                                openBoxIndices.dateIndex ===
                                                  index &&
                                                openBoxIndices.placeIndex ===
                                                  placeIndex && (
                                                  <>
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
                                                    <span>Add cost</span>
                                                  </>
                                                )
                                              ) : (
                                                <span
                                                  style={{
                                                    padding: "0 8px",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  $ {place.cost}
                                                </span>
                                              )}
                                            </button>
                                            {selectedCost &&
                                              selectedCost.dateIndex ===
                                                index &&
                                              selectedCost.placeIndex ===
                                                placeIndex && (
                                                <ItineraryCost
                                                  onSave={(cost) =>
                                                    updateItineraryCost(
                                                      index,
                                                      placeIndex,
                                                      cost
                                                    )
                                                  }
                                                  onCancel={() =>
                                                    setSelectedCost(null)
                                                  }
                                                />
                                              )}
                                          </div>
                                          <div
                                            className={
                                              place.startTime === "" ||
                                              place.cost === "" ||
                                              place.category === ""
                                                ? "mt-n3 mb-n2 ml-2"
                                                : "ml-2"
                                            }
                                          >
                                            <button
                                              type="button"
                                              className={
                                                place.category === ""
                                                  ? "btn-date btn-date1"
                                                  : "btn-date btn-date1 btn-time-cost"
                                              }
                                              style={{
                                                position: "relative",
                                              }}
                                              onClick={() =>
                                                handleAddCategory(
                                                  index,
                                                  placeIndex
                                                )
                                              }
                                            >
                                              {place.category === "" ? (
                                                openBoxIndices.dateIndex ===
                                                  index &&
                                                openBoxIndices.placeIndex ===
                                                  placeIndex && (
                                                  <>
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
                                                    <span>Tag category</span>
                                                  </>
                                                )
                                              ) : (
                                                <span
                                                  style={{
                                                    padding: "0 8px",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {place.category}
                                                </span>
                                              )}
                                            </button>
                                            {selectedCategory &&
                                              selectedCategory.dateIndex ===
                                                index &&
                                              selectedCategory.placeIndex ===
                                                placeIndex && (
                                                <ItineraryCategory
                                                  onSave={(category) =>
                                                    updateItineraryCategory(
                                                      index,
                                                      placeIndex,
                                                      category
                                                    )
                                                  }
                                                  onCancel={() =>
                                                    setSelectedCategory(null)
                                                  }
                                                />
                                              )}
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    {openBoxIndices.dateIndex === index &&
                                      openBoxIndices.placeIndex ===
                                        placeIndex && (
                                        <button
                                          class="btn btn-link"
                                          type="button"
                                          onClick={() =>
                                            handleRemovePlace(index, placeIndex)
                                          }
                                        >
                                          <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="far"
                                            data-icon="trash-can"
                                            class="svg-inline--fa fa-trash-can fa-w-14 "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
                                            ></path>
                                          </svg>
                                        </button>
                                      )}
                                  </div>
                                </div>
                              )}
                            </>
                          ))}
                        {isLoaded ? (
                          <SearchBox
                            onPlacesChange={(place) =>
                              onPlacesChanged(place, index)
                            }
                          />
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
            <button
              type="button"
              className="planbutton planbutton1"
              style={{ marginTop: "0px" }}
              onClick={() => onSubmit()}
            >
              Submit Plan
            </button>
          </div>
        </div>
        <div style={{ width: "460px" }}>
          <div className="itinerarymap">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle1}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                // onClick={placeClicked}
              >
                {/* {itinerary &&
                itinerary.map((itineraryItem, index) =>
                  itineraryItem?.places.map((place, placeIndex) => (
                    <OverlayView
                      position={{ lat: place.lat, lng: place.lng }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div>
                        <span
                          class="MarkerIconWithColor"
                          style={{ fontSize: "2rem" }}
                        >
                          <span class="MarkerIconWithColor__label MarkerIconWithColor__labelLarge">
                            {placeIndex + 1}
                          </span>
                          <span
                            class="MarkerIconWithColor__outlined"
                            style={{
                              color: colors[index],
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
                  ))
                )} */}
                {itinerary &&
                  itinerary.map((itineraryItem, index) => (
                    <React.Fragment key={index}>
                      {itineraryItem?.places.map((place, placeIndex) => (
                        <OverlayView
                          position={{ lat: place.lat, lng: place.lng }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div className="marker-container">
                            <span
                              class="MarkerIconWithColor marker-svg"
                              style={{ fontSize: "2rem" }}
                            >
                              <span class="MarkerIconWithColor__label MarkerIconWithColor__labelLarge">
                                {placeIndex + 1}
                              </span>
                              <span
                                class="MarkerIconWithColor__outlined"
                                style={{
                                  color: colors[index % colors.length],
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
                      ))}

                      {itineraryItem?.places.length > 1 && (
                        <Polyline
                          path={itineraryItem?.places.map((place) => ({
                            lat: place.lat,
                            lng: place.lng,
                          }))}
                          options={{
                            strokeColor: colors[index % colors.length], // Color for the line
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                            geodesic: true,
                            clickable: true,

                            // Additional options can be added here
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </GoogleMap>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanEdit;
