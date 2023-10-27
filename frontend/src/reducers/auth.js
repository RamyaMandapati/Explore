import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "../actions/types";
// const jwt_decode = require("jwt-decode");

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: [],
};

export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGIN_SUCCESS:
      //var decoded = jwt_decode(action.payload1.split(' ')[1]);
      //localStorage.setItem("username", decoded.email);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGOUT:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

// export const profileReducer = (state = {}, action) => {
//   switch (action.type) {
//     case UPDATE_PROFILE_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case UPDATE_PROFILE_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         isUpdated: action.payload,
//       };

//     case UPDATE_PROFILE_FAIL:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };

//     case UPDATE_PROFILE_RESET:
//       return {
//         ...state,
//         isUpdated: false,
//       };

//     case CLEAR_ERRORS:
//       return {
//         ...state,
//         error: null,
//       };

//     default:
//       return state;
//   }
// };

// export const addCurrency = (state = {}, action) => {
//   switch (action.type) {
//     case CURRENCY_SET:
//       return {
//         ...state,
//         currency: action.payload,
//       };
//     default:
//       return state;
//   }
// };
