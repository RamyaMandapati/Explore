/* eslint-disable no-unused-vars */
import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";

//import Reactdom from 'reactdom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Fragment } from "react";
// import { Landing } from './components/layout/Landing';
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/routing/PrivateRoute";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { useSelector, useDispatch } from "react-redux";
import ItinerarySelection from "./components/itinerary/itinerarySelection";
import MapComponent from "./components/itinerary/mapComponent";
import ItineraryCalendarPage from "./components/itinerary/itineraryCalendarPage";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/auth/Register";
import Preferences from "./components/auth/preferences";
import Login from "./components/auth/Login";
import Travelfeed from "./components/dashboard/Travelfeed";
import ItinerariesComponent from "./components/ItinariesComponent/ItinariesComponent.js";
import Newpost from "./components/Newpost/Newpost.js";
import { loadUser } from "./actions/auth";
import ItineraryPlanEdit from "./components/itinerary/itineraryPlanEdit";
import { Profile } from "./components/user/User";
import Messenger from "./components/Messenger/messenger.js";
import socket from "./utils/socket.js";
import { fetchNotifications } from "./actions/notificationAction";
import { updateNotification } from "./actions/notificationAction";

// import Footer from "./components/layout/Footer";
// if(localStorage.token){
//   setAuthToken(localStorage.token);
// }

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [socketUser, setSocketUser] = useState("");
  const userId = user && user._id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [userId, dispatch]);
  useEffect(() => {
    // Existing socket listeners...

    socket.on("updateMessageNotification", (notification) => {
      dispatch(updateNotification(notification));
    });

    // Cleanup if needed
    return () => {
      socket.off("updateNotification");
    };
  }, [dispatch, socket]);

  // if (user && user._id) {
  //   socket?.emit("newSocketUser", user._id);
  //   socket.on("socketUserInfo", (data) => {
  //     setSocketUser(data);
  //   });
  // }
  // const userid = user && user._id;
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  // return (
  //   <div className="App">
  //     <Itineraryselection />
  //   </div>
  // );
  return (
    <>
      <Router>
        {isAuthenticated && <Navbar />}

        <Fragment>
          <ProtectedRoute
            exact
            path="/plan"
            component={ItinerarySelection}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/itinerary"
            component={MapComponent}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/itinerary/:itineraryId"
            component={ItineraryCalendarPage}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/itineraryedit/:itineraryId"
            component={ItineraryPlanEdit}
          ></ProtectedRoute>
          <Route exact path="/register" component={Register}></Route>
          <ProtectedRoute
            exact
            path="/preference"
            component={Preferences}
          ></ProtectedRoute>
          <Route exact path="/" component={Login}></Route>
          <ProtectedRoute
            exact
            path="/messenger"
            component={Messenger}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/messenger/:conversationId"
            component={Messenger}
          ></ProtectedRoute>

          <ProtectedRoute
            exact
            path="/navbar"
            component={Navbar}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/travelFeed"
            component={Travelfeed}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/itineraries"
            component={ItinerariesComponent}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/newPost"
            component={Newpost}
          ></ProtectedRoute>

          {/* updates */}
          <ProtectedRoute
            exact
            path="/profile"
            component={Profile}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/profile/:id"
            component={Profile}
          ></ProtectedRoute>

          {/* <ProtectedRoute exact path="/EditUser" component={EditUser} />
    <section className="container">
      <Alert />
      <Switch></Switch>
    </section> */}
        </Fragment>
      </Router>
    </>
  );
};
export default App;
