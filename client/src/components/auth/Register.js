import React from 'react'
import {connect} from 'react-redux';
import { useState } from "react"
import {Form, Button} from 'react-bootstrap';
//import axios from 'axios';
//import { setAlert } from "../../actions/alert";
//import PropTypes from 'prop-types';
import { register } from "../../actions/auth";
import { useSelector,useDispatch } from "react-redux";
import { useAlert } from "react-alert";

export const Register = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [formData, setFormData] = useState({
        uname: '',
        email: '',
        mobile: '',
        password: '',
        confpassword: '',
        role:'',
    });
    const {uname,email,mobile,role,password,confpassword} = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value});
    const onSubmit = () => {
       // e.preventDefault();
        if(password !== confpassword){
           alert.error('Passwords not matched!');
        }
        else{
            dispatch(register({uname,email,mobile,role,password})).then(history.push("/")); 
         }
    }
    const onSubmit1 =() =>{
      history.push('/')
    }
    return (
<div className="container">
			<div className="register-form-shadow">
			</div>
			<div className="register-form">
			<h5>Registration Form</h5>
			<Form>

            <Form.Group className="mb-3" controlId="uname">
					<Form.Label>Name</Form.Label>
					<Form.Control
                    type="text"
                      name='uname'
                      value={uname}
                      onChange={e => onChange(e)}
                      aria-describedby="uname"/>
            </Form.Group>
                 
            <Form.Group className="mb-3" controlId="mobile">
					<Form.Label>Mobile</Form.Label>
					<Form.Control
                    type="text"
                      name='mobile'
                      value={mobile}
                      onChange={e => onChange(e)}
                      aria-describedby="mobile"/>
            </Form.Group>
                      
            <Form.Group className="mb-3">
          <Form.Label >Select Identity</Form.Label>
          <Form.Select name='role'
                      value={role}
                      onChange={e => onChange(e)}
                      aria-describedby="role">
            <option value="null">Select Role</option>
            <option value="farmer">farmer</option>
            <option value="pilot">pilot</option>
          </Form.Select>
        </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
                    type="text"
                      name='email'
                      value={email}
                      onChange={e => onChange(e)}
                      aria-describedby="email"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
                    type="password"
                      name='password'
                      value={password}
                      onChange={e => onChange(e)}
                      aria-describedby="password"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confpassword">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
                    type="password"
                      name='confpassword'
                      value={confpassword}
                      onChange={e => onChange(e)}
                      aria-describedby="confpassword"/>
            </Form.Group>
            </Form>
            <div className="btn_panel">
				<Button variant="primary" style={{backgroundColor:'#1A3447'}} onClick={() => onSubmit()}>Submit</Button>
			</div>
      </div>
            <div className="form-image">
          <img src="https://media.istockphoto.com/photos/agriculture-drone-fly-to-sprayed-fertilizer-on-the-green-tea-fie-picture-id898449496?b=1&k=20&m=898449496&s=170667a&w=0&h=OWhNtprLcXoTE8JCLde5MAFiyM6C3konPf3ZxxfJjmc=" alt="Sample image"/>
             </div>
		</div>
)
};
export default Register;