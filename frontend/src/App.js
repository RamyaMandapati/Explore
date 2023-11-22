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
import { useSelector } from "react-redux";
import ItinerarySelection from "./components/itinerary/itinerarySelection";
import ItineraryCreation from "./components/itinerary/itineraryCreation";
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
import Messenger from "./components/Messenger/messenger.js";
import socket from "./utils/socket.js";
// import Footer from "./components/layout/Footer";
// if(localStorage.token){
//   setAuthToken(localStorage.token);
// }

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [socketUser, setSocketUser] = useState("");

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
          <Route exact path="/plan" component={ItinerarySelection}></Route>
          <Route exact path="/itinerary" component={ItineraryCreation}></Route>
          <Route
            exact
            path="/itinerary/:itineraryId"
            component={ItineraryCalendarPage}
          ></Route>
          <Route
            exact
            path="/itineraryedit/:itineraryId"
            component={ItineraryPlanEdit}
          ></Route>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/preference" component={Preferences}></Route>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/messenger" component={Messenger}></Route>

          <Route exact path="/navbar" component={Navbar}></Route>
          <Route exact path="/travelFeed" component={Travelfeed}></Route>
          <Route
            exact
            path="/itineraries"
            component={ItinerariesComponent}
          ></Route>
          <Route exact path="/newPost" component={Newpost}></Route>

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
