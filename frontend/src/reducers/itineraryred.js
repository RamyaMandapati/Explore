import {
  ITINERARY_PLAN_DETAILS,
  ITINERARY_SAVE_SUCCESS,
  ITINERARY_DETAIL,
} from "../actions/types";

export const itineraryplanReducer = (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PLAN_DETAILS:
      return {
        ...state,
        itineraryplandet: action.payload,
      };
    case ITINERARY_SAVE_SUCCESS:
      return {
        ...state,
        itinerarysavedet: action.payload,
      };
    case ITINERARY_DETAIL:
      return {
        ...state,
        itinerarydet: action.payload,
      };
    default:
      return state;
  }
};
