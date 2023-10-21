import React, { useState } from "react";

import { StandaloneSearchBox } from "@react-google-maps/api";
export const SearchBox = ({ onPlacesChange }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="searchbox">
      <StandaloneSearchBox
        onLoad={(ref) => {
          ref.addListener("places_changed", () => {
            const places = ref.getPlaces();
            if (places.length > 0) {
              onPlacesChange(places[0]);
              setSearchValue("");
            }
          });
        }}
      >
        <input
          className="search_input"
          type="search"
          placeholder="Add a place"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
  );
};

export default SearchBox;
