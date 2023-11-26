import {
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  UPDATE_NOTIFICATION,
} from "../actions/types";
const initialState = {
  notifications: [],
  error: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_NOTIFICATIONS_SUCCESS":
      return { ...state, notifications: action.payload };
    case "FETCH_NOTIFICATIONS_FAILURE":
      return { ...state, error: action.error };
    case "UPDATE_NOTIFICATION":
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification._id === action.payload._id
      );

      if (notificationIndex !== -1) {
        // Update existing notification
        return {
          ...state,
          notifications: state.notifications.map((notification, index) =>
            index === notificationIndex ? action.payload : notification
          ),
        };
      } else {
        // Add new notification
        return {
          ...state,
          notifications: [...state.notifications, action.payload],
        };
      }
    default:
      return state;
  }
};
