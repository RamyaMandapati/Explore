import axios from "axios";
// import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "./types";

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/session", { withCredentials: true });
    console.log(res.data.user);
    dispatch({
      type: USER_LOADED,
      payload: res.data.user,
    });
  } catch (err) {
    // alert(err.response.data.message);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register =
  ({ userName, email, password, dateOfBirth, gender }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      userName,
      email,
      password,
      dateOfBirth,
      gender,
    });

    try {
      const res = await axios.post("/signup", body, config);
      console.log(res.data);
      if (!res.data.success) {
        alert("USER ALREADY EXISTS");
      } else {
        alert("USER REGISTRATION SUCCESSFUL");
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data.user,
        });
      }
    } catch (err) {
      alert("Error While Registering");
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post("/signin", body, config);
      if (res.data.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data.user,
        });
        //dispatch(loadUser());
      } else {
        dispatch({
          type: LOGIN_FAIL,
        });
        alert("Invalid credentials!");
      }
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        // errors.forEach(err => dispatch(setAlert(err.msg)));
      }
      if (err) {
        alert("user is not valid");
      }
    }
  };

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// //update user

// export const updateProfile = (email,uname,picture,address,mobile) => async (dispatch) => {
//     try {

//       dispatch({ type: UPDATE_PROFILE_REQUEST });

//       const config = { headers: {  'Content-Type': 'application/json'} };
//       const userData = {
//         uname : uname,
//         email : email,
//         mobile : mobile,
//         address : address,
//         picture :picture
//       }
//       console.log(userData);
//       const { data } = await axios.post(`/api/users/changeprofile`, userData, config);

//       dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
//     } catch (error) {
//       dispatch({
//         type: UPDATE_PROFILE_FAIL,
//         payload: error.response.data.message,
//       });
//     }
//   };

//   export const addpilotprofile= (uname,email,address,mobile,picture,pilotcertinfo,pilotlicense,billinginfo) => async (dispatch) => {
//     try {

//       dispatch({ type: UPDATE_PROFILE_REQUEST });

//       const config = { headers: {  'Content-Type': 'application/json'} };
//       const userData = {
//         uname : uname,
//         email : email,
//         mobile : mobile,
//         address : address,
//         picture :picture,
//         pilotcertinfo:pilotcertinfo,
//         pilotlicense:pilotlicense,
//         billinginfo:billinginfo,
//       }
//       console.log(userData);
//       const { data } = await axios.post(`/api/users/changeprofile`, userData, config);

//       dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
//     } catch (error) {
//       dispatch({
//         type: UPDATE_PROFILE_FAIL,
//         payload: error.response.data.message,
//       });
//     }
//   };

//   export function addUserCurrency(data) {
//     return {
//        type: CURRENCY_SET,
//        payload: data
//     }
//  }
//   export const clearErrors = () => async (dispatch) => {
//     dispatch({ type: CLEAR_ERRORS });
//   };
