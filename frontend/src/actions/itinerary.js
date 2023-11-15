import axios from "axios";
import { ITINERARY_SAVE_SUCCESS, ITINERARY_DETAIL } from "./types";

export const itinerarySave = (data) => {
  return {
    type: ITINERARY_SAVE_SUCCESS,
    payload: data,
  };
};

export const getItineraryDetails = (itineraryId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/itinerary/${itineraryId}`);
    if (res.data.success) {
      dispatch({
        type: ITINERARY_DETAIL,
        payload: res.data.itinerary,
      });
    }
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    alert(errors);
  }
};
