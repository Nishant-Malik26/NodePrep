import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../reducers/register';
import { useDispatch, useSelector } from 'react-redux';
import { FaSignOutAlt, FaRegUser } from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth);
  const { isAuthenticated, loading } = AuthData;
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>

      <li>
        <Link to='/dashboard'>
          {' '}
          <FaRegUser />
          Dashboard
        </Link>
      </li>
      <li>
        <a
          // style={{ display: 'flex', alignItems: 'center' }}
          href='#!'
          onClick={() => dispatch(logout())}
        >
          <FaSignOutAlt style={{ marginRight: '5px', marginTop: '4px' }} />{' '}
          Logout
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>

      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <>
      <nav className='navbar bg-dark'>
        <h1>
          <Link to='/dashboard'>
            <i className='fas fa-code'></i> DevConnector
          </Link>
        </h1>
        {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
      </nav>
    </>
  );
};

export default Navbar;
