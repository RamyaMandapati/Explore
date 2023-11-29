import "./itineraryTime.css";
import React, { useState, useRef, useEffect } from "react";

export const ItineraryTime = ({
  onSave,
  onCancel,
  initialStartTime,
  initialEndTime,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [focusedField, setFocusedField] = useState("startTime");
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const [isTimeValid, setIsTimeValid] = useState(true);

  // startTimeRef.current.focus();
  useEffect(() => {
    validateTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  const validateTime = () => {
    if (startTime && endTime) {
      // Assuming startTime and endTime are in a format that can be directly compared
      // If they're in a format like 'HH:MM AM/PM', you'll need to convert them to 24-hour format or to Date objects
      const start = new Date(`1970/01/01 ${startTime}`);
      const end = new Date(`1970/01/01 ${endTime}`);
      setIsTimeValid(start < end);
    } else {
      // Consider the scenario where either startTime or endTime might not be set
      setIsTimeValid(true);
    }
  };

  const handleOptionSelect = (option) => {
    if (focusedField === "startTime") {
      setStartTime(option);
      setFocusedField("endTime");
      endTimeRef.current.focus();
    } else if (focusedField === "endTime") {
      setEndTime(option);
      setFocusedField("startTime");
      startTimeRef.current.focus();
    }
    // validateTime();
  };

  const handleSave = () => {
    if (startTime && endTime) {
      onSave(startTime, endTime);
      // Clear the selected option, start time, and end time
      setSelectedOption("");
      setStartTime("");
      setEndTime("");
    } else {
      setIsTimeValid(false);
    }
  };

  const handleClear = () => {
    // Clear the selected option, start time, and end time
    setSelectedOption("");
    setStartTime("");
    setEndTime("");
    setFocusedField("startTime");
    startTimeRef.current.focus();

    // onSave("", "");

    // onCancel();
  };

  return (
    <div className="drop-down-menu">
      <form class="p-3 Deselect__doNotDeselect">
        <div class="d-flex align-items-center justify-content-center pb-2">
          <div class="position-relative d-flex align-items-center InputContainer">
            <div class="InputContainer__labelContainer w-100 h-100 InputContainer__smLabelContainer">
              <div class="InputContainer__label">
                <span>Start time</span>
              </div>
            </div>
            <input
              ref={startTimeRef}
              class={`smartlook-show form-control Input__input w-100 Input__small form-control-gray StartEndTimePickerInner__input focus`}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onFocus={() => setFocusedField("startTime")}
              placeholder="Start time"
            />
          </div>
          <div class="StartEndTimePickerInner__dash mx-2"></div>
          <div class="position-relative d-flex align-items-center InputContainer">
            <div class="InputContainer__labelContainer w-100 h-100 InputContainer__smLabelContainer">
              <div class="InputContainer__label">
                <span>End time</span>
              </div>
            </div>
            <input
              ref={endTimeRef}
              class={`smartlook-show form-control Input__input w-100 Input__small form-control-gray StartEndTimePickerInner__input`}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onFocus={() => setFocusedField("endTime")}
              placeholder="End time"
            />
          </div>
        </div>
        <div class="d-none d-sm-flex justify-content-center pb-2">
          <select
            size="8"
            class="StartEndTimePickerInner__select w-100 Select"
            onChange={(e) => {
              handleOptionSelect(e.target.value);
            }}
            value={selectedOption}
          >
            <option value="None" class="px-3 py-2 Select__option">
              Select Start Time and End Time
            </option>
            <option value="12:00 AM" class="px-3 py-2 Select__option">
              12:00 AM
            </option>
            <option value="12:30 AM" class="px-3 py-2 Select__option">
              12:30 AM
            </option>
            <option value="1:00 AM" class="px-3 py-2 Select__option">
              1:00 AM
            </option>
            <option value="1:30 AM" class="px-3 py-2 Select__option">
              1:30 AM
            </option>
            <option value="2:00 AM" class="px-3 py-2 Select__option">
              2:00 AM
            </option>
            <option value="2:30 AM" class="px-3 py-2 Select__option">
              2:30 AM
            </option>
            <option value="3:00 AM" class="px-3 py-2 Select__option">
              3:00 AM
            </option>
            <option value="3:30 AM" class="px-3 py-2 Select__option">
              3:30 AM
            </option>
            <option value="4:00 AM" class="px-3 py-2 Select__option">
              4:00 AM
            </option>
            <option value="4:30 AM" class="px-3 py-2 Select__option">
              4:30 AM
            </option>
            <option value="5:00 AM" class="px-3 py-2 Select__option">
              5:00 AM
            </option>
            <option value="5:30 AM" class="px-3 py-2 Select__option">
              5:30 AM
            </option>
            <option value="6:00 AM" class="px-3 py-2 Select__option">
              6:00 AM
            </option>
            <option value="6:30 AM" class="px-3 py-2 Select__option">
              6:30 AM
            </option>
            <option value="7:00 AM" class="px-3 py-2 Select__option">
              7:00 AM
            </option>
            <option value="7:30 AM" class="px-3 py-2 Select__option">
              7:30 AM
            </option>
            <option value="8:00 AM" class="px-3 py-2 Select__option">
              8:00 AM
            </option>
            <option value="8:30 AM" class="px-3 py-2 Select__option">
              8:30 AM
            </option>
            <option value="9:00 AM" class="px-3 py-2 Select__option">
              9:00 AM
            </option>
            <option value="9:30 AM" class="px-3 py-2 Select__option">
              9:30 AM
            </option>
            <option value="10:00 AM" class="px-3 py-2 Select__option">
              10:00 AM
            </option>
            <option value="10:30 AM" class="px-3 py-2 Select__option">
              10:30 AM
            </option>
            <option value="11:00 AM" class="px-3 py-2 Select__option">
              11:00 AM
            </option>
            <option value="11:30 AM" class="px-3 py-2 Select__option">
              11:30 AM
            </option>
            <option value="12:00 PM" class="px-3 py-2 Select__option">
              12:00 PM
            </option>
            <option value="12:30 PM" class="px-3 py-2 Select__option">
              12:30 PM
            </option>
            <option value="1:00 PM" class="px-3 py-2 Select__option">
              1:00 PM
            </option>
            <option value="1:30 PM" class="px-3 py-2 Select__option">
              1:30 PM
            </option>
            <option value="2:00 PM" class="px-3 py-2 Select__option">
              2:00 PM
            </option>
            <option value="2:30 PM" class="px-3 py-2 Select__option">
              2:30 PM
            </option>
            <option value="3:00 PM" class="px-3 py-2 Select__option">
              3:00 PM
            </option>
            <option value="3:30 PM" class="px-3 py-2 Select__option">
              3:30 PM
            </option>
            <option value="4:00 PM" class="px-3 py-2 Select__option">
              4:00 PM
            </option>
            <option value="4:30 PM" class="px-3 py-2 Select__option">
              4:30 PM
            </option>
            <option value="5:00 PM" class="px-3 py-2 Select__option">
              5:00 PM
            </option>
            <option value="5:30 PM" class="px-3 py-2 Select__option">
              5:30 PM
            </option>
            <option value="6:00 PM" class="px-3 py-2 Select__option">
              6:00 PM
            </option>
            <option value="6:30 PM" class="px-3 py-2 Select__option">
              6:30 PM
            </option>
            <option value="7:00 PM" class="px-3 py-2 Select__option">
              7:00 PM
            </option>
            <option value="7:30 PM" class="px-3 py-2 Select__option">
              7:30 PM
            </option>

            <option value="8:00 PM" class="px-3 py-2 Select__option">
              8:00 PM
            </option>
            <option value="8:30 PM" class="px-3 py-2 Select__option">
              8:30 PM
            </option>
            <option value="9:00 PM" class="px-3 py-2 Select__option">
              9:00 PM
            </option>
            <option value="9:30 PM" class="px-3 py-2 Select__option">
              9:30 PM
            </option>
            <option value="10:00 PM" class="px-3 py-2 Select__option">
              10:00 PM
            </option>
            <option value="10:30 PM" class="px-3 py-2 Select__option">
              10:30 PM
            </option>
            <option value="11:00 PM" class="px-3 py-2 Select__option">
              11:00 PM
            </option>
            <option value="11:30 PM" class="px-3 py-2 Select__option">
              11:30 PM
            </option>
          </select>
        </div>
        {!isTimeValid && (
          <div className="error-message" style={{ color: "red" }}>
            Start time must be less than end time.
          </div>
        )}
        <div class="d-flex pt-2 justify-content-center">
          <button
            type="button"
            tabindex="0"
            class="Button Button__light-gray Button__md Button__shape__pill overflow-hidden Button__withLabel mr-2"
            onClick={handleClear}
          >
            <div class="flex-grow-1 flex-shrink-1 minw-0">
              <div class="Button__label flex-shrink-1 minw-0">
                <span class="Button__labelText flex-shrink-1 minw-0">
                  Clear
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            tabindex="0"
            class="Button Button__brand Button__md Button__shape__pill overflow-hidden Button__withLabel"
            onClick={handleSave}
            disabled={!isTimeValid}
          >
            <div class="flex-grow-1 flex-shrink-1 minw-0">
              <div class="Button__label flex-shrink-1 minw-0">
                <span class="Button__labelText flex-shrink-1 minw-0">Save</span>
              </div>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ItineraryTime;
