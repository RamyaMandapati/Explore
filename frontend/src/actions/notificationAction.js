import axios from "axios";
import {
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  UPDATE_NOTIFICATION,
} from "./types";
// Action to fetch notifications
export const fetchNotifications = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/messages/notifications/${userId}`);
    dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Error fetching notifications", error);
    dispatch({ type: "FETCH_NOTIFICATIONS_FAILURE", error });
  }
};

// Action to update a single notification
export const updateNotification = (notification) => {
  return {
    type: "UPDATE_NOTIFICATION",
    payload: notification,
  };
};
