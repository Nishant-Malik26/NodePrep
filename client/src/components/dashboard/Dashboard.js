import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../reducers/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = () => {
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth.user);
  const ProfileData = useSelector((state) => state.Profile);
  const { profile } = ProfileData;

  useEffect(() => {
    dispatch(getProfile());
  }, []);
  return (
    <div>
      {ProfileData?.loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>Welcome {AuthData.user && AuthData.user.name}</p>
          {profile !== null ? (
            <>
              <DashboardActions />
              <Experience experience={profile?.experience} />
              <Education education={profile?.education} />
            </>
          ) : (
            <>
              <p>Your Profile is not complete, Please Add Info</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
