import React, { useState, useEffect, useRef } from "react";
import "./itinerary.css";

import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import { ITINERARY_PLAN_DETAILS } from "../../actions/types";
import { useDispatch, useSelector } from "react-redux";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(cities)"] }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(addressObject);
}

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

  const today = dayjs();
  const [errorLocation, setLocationError] = useState(false);

  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
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
    (itineraryplandet && itineraryplandet.startDate) || today
  );
  const [endDate, setEndDate] = useState(
    (itineraryplandet && itineraryplandet.endDate) || today
  );
  const [budget, setBudget] = useState(
    (itineraryplandet && itineraryplandet.budget) || ""
  );
  const [errorDate, setDateError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAUmGqs6vCSNoKHWwvYfifpkOJ5lZLrUBo&libraries=places`,
      () => handleScriptLoad(setLocation, autoCompleteRef)
    );
  }, []);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClick = () => {
    dispatch({
      type: ITINERARY_PLAN_DETAILS,
      payload: {
        location: location,
        startDate: startDate,
        endDate: endDate,
        interests: interests,
        budget: budget,
      },
    }).then(history.push("/itinerary"));
  };

  return (
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
          required
          // autoComplete=""
          inputRef={autoCompleteRef}
          error={errorLocation}
          value={location}
          // helperText={errorMsg}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2 }}
        />
      </div>
      <>
        <div className="itinerarybox1">
          {/* <span className="message">Dates (optional)</span> */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateRangePicker"]}>
              <DateRangePicker
                localeText={{ start: "Start Date", end: "End Date" }}
                slotProps={{
                  fieldSeparator: { children: "to" },
                }}
                startProps={{
                  textField: {
                    InputProps: { endAdornment: <Calendar /> },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider> */}
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
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
          <div>
            <InputLabel id="demo-multiple-checkbox-label" sx={{ mt: 1 }}>
              Interests
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={interests}
              label="intersts"
              onChange={handleChange}
              input={<OutlinedInput label="Interests" />}
              renderValue={(selected) => selected.join(", ")}
              sx={{ width: 540 }}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={interests.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
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
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ width: 540, mt: 3 }}
          />
          {errorLocation || errorDate ? (
            <Error>
              Make sure you enter location, start date and end date{" "}
            </Error>
          ) : (
            <p />
          )}
          <button
            type="button"
            className="planbutton planbutton1"
            onClick={handleClick}
          >
            Start Planning
          </button>
        </div>
      </>
    </div>
  );

  //   function Search() {
  //     const {
  //       ready,
  //       value,
  //       suggestions: { data },
  //       setValue,
  //       clearSuggestions,
  //     } = usePlacesAutocomplete();

  //     const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  //     const [isOpen, setIsOpen] = useState(false);

  //     const handleInput = (e) => {
  //       const inputValue = e.target.value;
  //       setValue(inputValue);
  //       setIsOpen(true);
  //     };
  //     const handlePopoverClose = () => {
  //       setIsOpen(false);
  //     };
  //     const handleSelect = async (suggestion) => {
  //       setValue(suggestion.description, false);
  //       setIsOpen(false);
  //       console.log(suggestion);
  //       clearSuggestions();
  //     };

  //     return (
  //       <div className="input-container">
  //         <input
  //           id="input"
  //           value={value}
  //           onChange={handleInput}
  //           disabled={!ready}
  //           placeholder="E.g., New York, NY"
  //         />
  //         {isOpen && (
  //           <Popover
  //             isOpen={isOpen}
  //             onClose={handlePopoverClose}
  //             content={() => (
  //               <div className="suggestions">
  //                 {data && data.length > 0 && (
  //                   <ul>
  //                     {data.map((suggestion) => (
  //                       <li
  //                         key={suggestion.id}
  //                         onClick={() => handleSelect(suggestion)}
  //                       >
  //                         {suggestion.description} city
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 )}
  //               </div>
  //             )}
  //           />
  //         )}
  //       </div>
  //       //     <div className="suggestions">
  //       //       {data && data.length > 0 && (
  //       //         <ul>
  //       //           {data.map((suggestion) => (
  //       //             <li
  //       //               key={suggestion.id}
  //       //               onClick={() => handleSelect(suggestion)}
  //       //             >
  //       //               {suggestion.description} city
  //       //             </li>
  //       //           ))}
  //       //         </ul>
  //       //       )}
  //       //     </div>
  //       //   </Popover>
  //       // </div>
  //     );
  //   }
  // };
};

export default ItinerarySelection;
