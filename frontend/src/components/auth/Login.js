import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import { login} from '../../actions/auth';

import { useSelector,useDispatch } from "react-redux";
import './Login.css'

export const Login = ({history}) => {

    const dispatch= useDispatch();
    const {isAuthenticated,user} = useSelector((state)=> state.auth);
    console.log(isAuthenticated)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    //const successlogin = '';
    const {email,password} = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value});
    const onSubmit = () => {
        //e.preventDefault();
        //console.log("HI");
        //return <Redirect to="/register" />;
        dispatch(login({email,password}));
            
    };

    useEffect(() => {
        if (isAuthenticated && user && user.role === 'farmer') {
            history.push("/Dronebooking");
        }
        if (isAuthenticated && user && user.role === 'pilot') {
            history.push("/Pilotprofile");
        }
        if (isAuthenticated && user && user.role === 'admin') {
            history.push("/Dronecatalog");
        }
    }, [history,isAuthenticated,user]);

    return (
        <div className="container">
        <div className="login-form-shadow">
        </div>
        <div className="login-form">
            <div className="main-div">
                <div className="login-panel">
                    <h2>Login</h2>
                    <p>Please enter your emailid and password</p>
                    <div className="form-group">
                        <input  type="email" className="form-control" name="email" value={email} placeholder="Username" onChange={e => onChange(e)}/>
                    </div>
                    <div className="form-group" style={{marginTop: '10px'}}>
                        <input  type="password" className="form-control" name="password" value={password} placeholder="Password" onChange={e => onChange(e)}/>
                    </div>
                    <button onClick = {() => onSubmit()} style={{marginTop: '20px',backgroundColor:'#1A3447'}} className="btn btn-primary">Login</button>  
				<div className="d-flex justify-content-center links" style={{marginTop: '10px'}}>
					Don't have an account?<Link style={{Color:'#1A3447'}} to = '/register'>Sign up</Link>
				</div>               
                </div>
            </div>
        </div>
        <div className="form-image">
          <img src="https://media.istockphoto.com/photos/agriculture-drone-fly-to-sprayed-fertilizer-on-the-green-tea-fie-picture-id898449496?b=1&k=20&m=898449496&s=170667a&w=0&h=OWhNtprLcXoTE8JCLde5MAFiyM6C3konPf3ZxxfJjmc=" alt="Sample image"/>
             </div>
    </div>
    )
}



export default Login;
