// import axios from 'axios';
// //import { setAlert } from './alert';
// import{
//     REGISTER_SUCCESS,
//     REGISTER_FAIL,
//     USER_LOADED,
//     AUTH_ERROR,
//     LOGIN_SUCCESS,
//     LOGIN_FAIL,
//     LOGOUT,
//     UPDATE_PROFILE_SUCCESS,
//     UPDATE_PROFILE_FAIL,
//     UPDATE_PROFILE_REQUEST,
//     CLEAR_ERRORS,
//     CURRENCY_SET,
// } from './types';
// //import setAuthToken from '../utils/setAuthToken';

// export const loadUser = () =>async dispatch => {

//     try {
//         // axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
//         const res = await axios.get('/api/auth/authentication', {
//             headers: {
//               'authorization': localStorage.getItem('token')
//             }
//           });
//         console.log(res.data.user);
//         dispatch({
//             type: USER_LOADED,
//             payload: res.data.user,
//         });
//     } catch (err) {
//         const errors = err.response.data.errors;
//         console.log(errors)
//         dispatch({
//             type: AUTH_ERROR,
//         })
//     }
// };

// export const register = ({uname, mobile,role,email, password,}) => async dispatch =>{
// const config = {
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }
// const body = JSON.stringify({uname, mobile,role, email, password});

// try{
//     const res = await axios.post('/api/users/register',body,config);
//     if(res.data==='failure'){
//         alert("USER ALREADY EXISTS");
//     }
//     else{
//         alert("USER REGISTRATION SUCCESSFUL")
//     }
//     dispatch({
//         type: REGISTER_SUCCESS,
//         payload: res.data.userInfo
//     })
// }catch(err){
//     const errors = err.response.data.errors;

//     dispatch({
//         type: REGISTER_FAIL
//     })
// }
// }

// export const login = ({ email, password}) => async (dispatch) =>{
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }
//     const body = JSON.stringify({ email, password});
//     localStorage.setItem('email', email);
//     try{
//         const res = await axios.post('/api/users/login',body,config);
//         console.log(res.data);
//         if(res.data.success){
//             dispatch({
//                 type: LOGIN_SUCCESS,
//                 payload: res.data.user,
//                 payload1 : res.data.token
//             });
//             //dispatch(loadUser());

//          }
//          else{
//             dispatch({
//                 type: LOGIN_FAIL,
//             })
//             alert("Invalid credentials!");
//          }

//     }catch(err){
//         console.log(JSON.stringify(err));
//         const errors = err.response.data.errors;
//                 if(errors){
//            // errors.forEach(err => dispatch(setAlert(err.msg)));
//         }
//         if(err)
//         {
//             alert("user is not valid");
//     }
//     }
//     };
// export const logout = () => dispatch => {
//     dispatch({type: LOGOUT});
// }

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
