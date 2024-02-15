import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({});
  const { email, password } = formData;
  const handleInputChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    console.log(formData);
  };
  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form action={onSubmit} className='form'>
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

        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link href='/register'>Sign Up</Link>
      </p>
    </>
  );
};

export default Login;
