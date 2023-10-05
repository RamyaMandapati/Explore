import { ITINERARY_PLAN_DETAILS } from "../actions/types";

export const itineraryplanReducer = (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PLAN_DETAILS:
      return {
        ...state,
        itineraryplandet: action.payload,
      };
    default:
      return state;
  }
};
