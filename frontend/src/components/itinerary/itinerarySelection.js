import React, { useState, useEffect, useRef } from "react";
import "./itinerary.css";
import axios from "axios";
import { useJsApiLoader } from "@react-google-maps/api";

import TextField from "@mui/material/TextField";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import { ITINERARY_PLAN_DETAILS } from "../../actions/types";
import { useDispatch, useSelector } from "react-redux";
import { CustomCheckbox, StyledFormControl } from "./CustomComponents";
import LoadingScreen from "react-loading-screen";
import loading from "../../images/loading.gif";
// let autoComplete;

// const loadScript = (url, callback) => {
//   let script = document.createElement("script");
//   script.type = "text/javascript";

//   if (script.readyState) {
//     script.onreadystatechange = function () {
//       if (script.readyState === "loaded" || script.readyState === "complete") {
//         script.onreadystatechange = null;
//         callback();
//       }
//     };
//   } else {
//     script.onload = () => callback();
//   }

//   script.src = url;
//   document.getElementsByTagName("head")[0].appendChild(script);
// };

// function handleScriptLoad(updateQuery, autoCompleteRef) {
//   autoComplete = new window.google.maps.places.Autocomplete(
//     autoCompleteRef.current,
//     { types: ["(cities)"] }
//   );
//   autoComplete.setFields(["address_components", "formatted_address"]);
//   autoComplete.addListener("place_changed", () =>
//     handlePlaceSelect(updateQuery)
//   );
// }

// async function handlePlaceSelect(updateQuery) {
//   const addressObject = autoComplete.getPlace();
//   const query = addressObject.formatted_address;
//   updateQuery(query);
//   console.log(addressObject);
// }

export const ItinerarySelection = ({ history }) => {
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
  const dispatch = useDispatch();

  const [errorLocation, setLocationError] = useState(false);

  // const autoCompleteRef = useRef(null);
  const itineraryplandet = useSelector(
    (state) => state.itinerary.itineraryplandet
  );
  const [location, setLocation] = useState(
    (itineraryplandet && itineraryplandet.location) || ""
  );
  const [interests, setInterests] = useState(
    (itineraryplandet && itineraryplandet.interests) || []
  );
  const [startDate, setStartDate] = useState(
    itineraryplandet && itineraryplandet.startDate
  );
  const [endDate, setEndDate] = useState(
    itineraryplandet && itineraryplandet.endDate
  );
  const [budget, setBudget] = useState(
    (itineraryplandet && itineraryplandet.budget) || ""
  );
  const [errorDate, setDateError] = useState(false);
  const [errorBudget, setErrorBudget] = useState(false);
  const [errorInterests, setErrorInterests] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAUmGqs6vCSNoKHWwvYfifpkOJ5lZLrUBo",
    libraries: ["drawing", "places", "geometry"],
  });

  const autoCompleteRef = useRef(null);
  let autoComplete;

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: ["(cities)"] }
    );
    autoComplete.setFields(["address_components", "formatted_address"]);
    autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(updateQuery)
    );
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);
  };

  useEffect(() => {
    if (isLoaded) {
      handleScriptLoad(setLocation, autoCompleteRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setErrorInterests(false);
    setInterests(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClick = () => {
    setLocationError(false);
    setDateError(false);
    setErrorInterests(false);
    setErrorBudget(false);
    if (!location) {
      setLocationError(true);
    }
    if (!budget) {
      setErrorBudget(true);
    }
    if (!startDate || !endDate) {
      setDateError(true);
    }
    if (interests.length === 0) {
      setErrorInterests(true);
    }

    if (budget && location && startDate && endDate && interests.length !== 0) {
      dispatch({
        type: ITINERARY_PLAN_DETAILS,
        payload: {
          location: location.split(",")[0].trim(),
          startDate: startDate,
          endDate: endDate,
          interests: interests,
          budget: budget,
        },
      }).then(history.push("/itinerary"));
    }
  };

  const handleClickItineraryGenerate = () => {
    setLocationError(false);
    setDateError(false);
    setErrorInterests(false);
    setErrorBudget(false);
    if (!location) {
      setLocationError(true);
    }
    if (!budget) {
      setErrorBudget(true);
    }
    if (!startDate || !endDate) {
      setDateError(true);
    }
    if (interests.length === 0) {
      setErrorInterests(true);
    }

    if (budget && location && startDate && endDate && interests.length !== 0) {
      setLoading(true);

      const data = {
        destination: location,
        startDate: startDate,
        endDate: endDate,
        interests: interests,
        budget: budget,
      };
      axios
        .post("/api/itinerary/openai", data)
        .then((response) => {
          if (response.data) {
            dispatch({
              type: ITINERARY_PLAN_DETAILS,
              payload: {
                location: location,
                startDate: startDate,
                endDate: endDate,
                interests: interests,
                budget: budget,
                itineraryList: response.data,
              },
            }).then(history.push("/itinerary"));
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(true);
          console.log(error);
        });
    }
  };

  return (
    <div>
      <LoadingScreen
        loading={isLoading}
        bgColor="#f1f1f1"
        textColor="#676767"
        logoSrc={loading}
        text="Loading your Plan!"
      />
      <div className="itineraryselection">
        <div>
          <h1>Plan a new trip</h1>
        </div>
        <div className="itinerarybox">
          <TextField
            className="plan__location"
            name="location"
            id="plan-location-input"
            label="Where to?"
            type="text"
            // InputProps={{ sx: { height: 45 } }}
            required
            // autoComplete=""
            inputRef={autoCompleteRef}
            error={errorLocation}
            value={location}
            // helperText={errorMsg}
            onChange={(e) => {
              setLocationError(false);
              setLocation(e.target.value);
            }}
            // sx={{ mb: 2 }}
            sx={{
              "& .MuiInputLabel-root.Mui-focused": { color: "#aeb6f3" },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "#aeb6f3",
                },
              },
              mb: 2,
            }}
          />
        </div>
        <>
          <div className="itinerarybox1">
            <Stack direction="row" spacing={6}>
              {/* <DatePicker label="Basic date picker" /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    required
                    disablePast
                    defaultValue={startDate}
                    label="Start Date"
                    onChange={(e) => setStartDate(e)}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": { color: "#aeb6f3" },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                          borderColor: "#aeb6f3",
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    required
                    minDate={startDate}
                    defaultValue={endDate}
                    disablePast
                    label="End Date"
                    onChange={(e) => setEndDate(e)}
                    error={errorDate}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": { color: "#aeb6f3" },
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
                  multiple
                  value={interests}
                  onChange={handleChange}
                  InputProps={{ sx: { height: 45 } }}
                  input={<OutlinedInput label="Interests" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  required
                  error={errorInterests}
                  sx={{
                    width: 540,
                  }}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <CustomCheckbox checked={interests.indexOf(name) > -1} />
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
              required
              onChange={(e) => {
                setErrorBudget(false);
                setBudget(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              error={errorBudget}
              sx={{
                width: 540,
                mt: 3,
                "& .MuiInputLabel-root.Mui-focused": { color: "#aeb6f3" },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& > fieldset": {
                    borderColor: "#aeb6f3",
                  },
                },
              }}
            />
            {errorLocation || errorDate || errorBudget || errorInterests ? (
              <Error>
                Make sure you enter location, start date, end date, interests,
                budget
              </Error>
            ) : (
              <p />
            )}
            <div className="add-flex">
              <button
                type="button"
                className="planbutton planbutton1 aibutton"
                onClick={handleClick}
                disabled={
                  errorLocation || errorDate || errorBudget || errorInterests
                }
              >
                Start Planning
              </button>
              <button
                type="button"
                className="planbutton planbutton1 aibutton"
                onClick={handleClickItineraryGenerate}
                disabled={
                  errorLocation || errorDate || errorBudget || errorInterests
                }
              >
                Get Plan
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ItinerarySelection;
