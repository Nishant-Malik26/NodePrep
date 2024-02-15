import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { setAlertWithRemove } from '../../reducers/removeAlert';
const Register = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const { name, email, password, password1 } = formData;
  const handleInputChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password1) {
      dispatch(
        setAlertWithRemove({
          id: uuid(),
          msg: 'Incorrect Password',
          alertType: 'danger',
        })
      );
    }
    console.log(formData);
  };
  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form action='dashboard.html' onSubmit={onSubmit} className='form'>
        <div className='form-group'>
          <input
            name='name'
            type='text'
            value={name}
            placeholder='Name'
            required
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            name='email'
            value={email}
            onChange={(e) => handleInputChange(e)}
            placeholder='Email Address'
          />
          <small className='form-text'>
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => handleInputChange(e)}
            placeholder='Password'
            minlength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password1'
            value={password1}
            onChange={(e) => handleInputChange(e)}
            placeholder='Confirm Password'
            minlength='6'
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link href='login.html'>Sign In</Link>
      </p>
    </>
  );
};

export default Register;
