import "./itineraryTime.css";
import React, { useState } from "react";

export const ItineraryTime = ({ onSave, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleOptionSelect = (option) => {
    if (!startTime) {
      setStartTime(option);
    } else {
      setEndTime(option);
    }
  };

  const handleSave = () => {
    onSave(startTime, endTime);
    // Clear the selected option, start time, and end time
    setSelectedOption("");
    setStartTime("");
    setEndTime("");
  };

  const handleClear = () => {
    // Clear the selected option, start time, and end time
    setSelectedOption("");
    setStartTime("");
    setEndTime("");
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
              class="smartlook-show form-control Input__input w-100 Input__small form-control-gray StartEndTimePickerInner__input focus"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
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
              class="smartlook-show form-control Input__input w-100 Input__small form-control-gray StartEndTimePickerInner__input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
            type="submit"
            tabindex="0"
            class="Button Button__brand Button__md Button__shape__pill overflow-hidden Button__withLabel"
            onClick={handleSave}
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
