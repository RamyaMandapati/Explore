import "./itineraryTime.css";
import React, { useState } from "react";

export const ItineraryCost = ({ onSave, onCancel }) => {
  const [cost, setCost] = useState("");
  const handleSave = () => {
    onSave(cost);
    setCost("");
  };

  const handleClear = () => {
    setCost("");
  };
  return (
    <div className="drop-down-menu1">
      <div className="add-flex cost_box">
        <span>$</span>
        <input
          type="text"
          placeholder="0"
          className="cost_input"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>
      <div class="d-flex pt-2 mb-20 justify-content-center">
        <button
          type="button"
          className="Button Button__light-gray Button__md Button__label Button__shape__pill overflow-hidden Button__withLabel mr-2"
          onClick={handleClear}
        >
          clear
        </button>
        <button
          type="submit"
          className="Button Button__brand Button__label Button__md Button__shape__pill overflow-hidden Button__withLabel"
          onClick={handleSave}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default ItineraryCost;
