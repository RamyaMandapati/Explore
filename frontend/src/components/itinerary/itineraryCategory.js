import "./itineraryTime.css";
import React, { useState } from "react";

export const ItineraryCategory = ({ onSave, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [category, setCategory] = useState("");

  const handleOptionSelect = (option) => {
    setCategory(option);
  };

  const handleSave = () => {
    onSave(category);
    // Clear the selected option, start time, and end time
    setSelectedOption("");
    setCategory("");
  };

  const handleClear = () => {
    // Clear the selected option, start time, and end time
    setSelectedOption("");
    setCategory("");
  };

  return (
    <div className="drop-down-menu drop-down-menu2">
      <form class="p-3 Deselect__doNotDeselect">
        <div className="add-flex cost_box cost_box1">
          <input
            type="text"
            placeholder="Category"
            className="cost_input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        {/* <div class="d-flex align-items-center justify-content-center pb-2">
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
        </div> */}
        <div class="d-none d-sm-flex justify-content-center pb-2">
          <select
            size="8"
            class="StartEndTimePickerInner__select w-100 Select"
            onChange={(e) => {
              handleOptionSelect(e.target.value);
            }}
            value={selectedOption}
          >
            <option value="none" class="px-3 py-2 Select__option">
              Select Category
            </option>
            <option value="Hiking" class="px-3 py-2 Select__option">
              Hiking
            </option>
            <option value="Nightlife" class="px-3 py-2 Select__option">
              Nightlife
            </option>
            <option value="Museum" class="px-3 py-2 Select__option">
              Museum
            </option>
            <option value="Park" class="px-3 py-2 Select__option">
              Park
            </option>
            <option value="Bridge" class="px-3 py-2 Select__option">
              Bridge
            </option>
            <option value="Neighborhood" class="px-3 py-2 Select__option">
              Neighborhood
            </option>
            <option value="Landmark" class="px-3 py-2 Select__option">
              Landmark
            </option>
            <option value="Kid-friendly" class="px-3 py-2 Select__option">
              Kid-friendly
            </option>
            <option value="Beach" class="px-3 py-2 Select__option">
              Beach
            </option>
            <option value="Amusement Park" class="px-3 py-2 Select__option">
              Amusement Park
            </option>
            <option value="Restaurant" class="px-3 py-2 Select__option">
              Restaurant
            </option>
            <option value="Fishing" class="px-3 py-2 Select__option">
              Fishing
            </option>
            <option value="Music" class="px-3 py-2 Select__option">
              Music
            </option>
            <option value="Diving" class="px-3 py-2 Select__option">
              Diving
            </option>
            <option value="Dancing" class="px-3 py-2 Select__option">
              Dancing
            </option>
            <option value="Mountain Biking" class="px-3 py-2 Select__option">
              Mountain Biking
            </option>
            <option value="Rafting" class="px-3 py-2 Select__option">
              Rafting
            </option>
            <option value="Surfing" class="px-3 py-2 Select__option">
              Surfing
            </option>
            <option value="Sailing" class="px-3 py-2 Select__option">
              Sailing
            </option>
            <option value="Camping" class="px-3 py-2 Select__option">
              Camping
            </option>
            <option value="Transgender" class="px-3 py-2 Select__option">
              Transgender
            </option>
            <option value="Male" class="px-3 py-2 Select__option">
              Male
            </option>
            <option value="FeMale" class="px-3 py-2 Select__option">
              FeMale
            </option>
            <option value="Baby-friendly" class="px-3 py-2 Select__option">
              Baby-friendly
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
export default ItineraryCategory;
