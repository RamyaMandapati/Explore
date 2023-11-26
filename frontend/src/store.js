import { createStore, combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./reducers/auth";
import { itineraryplanReducer } from "./reducers/itineraryred";
import { notificationReducer } from "./reducers/notificationRed";

const reducer = combineReducers({
  auth: authReducer,
  itinerary: itineraryplanReducer,
  notifications: notificationReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
