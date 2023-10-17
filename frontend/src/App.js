/* eslint-disable no-unused-vars */
import logo from "./logo.svg";
import "./App.css";
import React from "react";
//import Reactdom from 'reactdom';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Fragment, useEffect } from "react";
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
import Travelfeed from "./components/dashboard/Travelfeed";


// import Footer from "./components/layout/Footer";
// if(localStorage.token){
//   setAuthToken(localStorage.token);
// }

const App = () => {
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  // const userid = user && user._id;
  // useEffect(() => {
  //   store
  //     .dispatch(loadUser())
  //     .then(() => store.dispatch(getfarmdetails(userid)));
  // }, [userid]);

  // return (
  //   <div className="App">
  //     <Itineraryselection />
  //   </div>
  // );
  return (
    <Router>
      <Fragment>
        <Route exact path="/" component={ItinerarySelection}></Route>
        <Route exact path="/itinerary" component={ItineraryCreation}></Route>
        <Route
          exact
          path="/itinerary/detail"
          component={ItineraryCalendarPage}
        ></Route>
        <Route exact path="/navbar" component={Navbar}></Route>
        <Route exact path="/travelFeed" component={Travelfeed}></Route>

        {/* <ProtectedRoute exact path="/EditUser" component={EditUser} />
        <section className="container">
          <Alert />
          <Switch></Switch>
        </section> */}
      </Fragment>
    </Router>
  );
};
export default App;
