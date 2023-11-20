import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../logo.png';
import { register } from '../../actions/auth';

export const Register = ({ history }) => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
  });
  const { userName, email, password, dateOfBirth, gender } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = () => {
    // e.preventDefault();
    dispatch(register({ userName, email, password, dateOfBirth, gender }));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      history.push('/preference');
    }
  }, [history, isAuthenticated, user]);

  const onSignUp = () => {
    history.push('/register');
  };

  const onLogin = () => {
    history.push('/');
  };

  return (
    <div className='login-cont'>
      <div className='nav-flex'>
        <img className='logo-img' src={logo} alt='Logo' />
        <div className='add-flex '>
          <button className='login-nav-btn' onClick={() => onSignUp()}>
            Signup
          </button>
          <button
            className='signup-nav-btn'
            style={{ marginLeft: '24px', marginRight: '36px' }}
            onClick={() => onLogin()}
          >
            Login
          </button>
        </div>
      </div>
      <div className='container login' style={{ alignItems: 'flex-start' }}>
        <div className='space-top'>
          <div className='image-section'>
            <h1>Adventure awaits!</h1>
            {/* <h1 id="h2-header"> awaits! Plan now.</h1> */}
            <div className='overlay'></div>
          </div>
        </div>
        <div className='login-section sign-up-section'>
          <h1 style={{ marginBottom: '20px', fontSize: '2em' }}>
            Get Started For Free!
          </h1>
          <div className='form-group'>
            <label>Name</label>
            <input
              type='text'
              placeholder='Enter your name'
              name='userName'
              value={userName}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              placeholder='name@gmail.com'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='6+ characters'
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <label>Date of Birth</label>
            <input
              type='text'
              name='dateOfBirth'
              placeholder='mm/dd/yy'
              value={dateOfBirth}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <label>Gender</label>
            <select
              className='select-but'
              name='gender'
              value={gender}
              onChange={(e) => onChange(e)}
            >
              <option>Select Gender</option>
              <option key='male'>Male</option>
              <option key='female'>Female</option>
            </select>
          </div>

          <button className='login-btn' onClick={() => onSubmit()}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
