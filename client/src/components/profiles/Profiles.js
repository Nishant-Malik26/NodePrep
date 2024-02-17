import React, { useEffect } from 'react';
import Spinner from '../layout/Spinner';
import { getAllProfiles } from '../../reducers/profile';
import { useDispatch, useSelector } from 'react-redux';
import ProfileItem from './ProfileItem';

const Profiles = () => {
  const dispatch = useDispatch();
  const ProfileData = useSelector((state) => state.Profile);
  const { profiles, loading } = ProfileData;
  useEffect(() => {
    dispatch(getAllProfiles());
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop' /> Browse and connect with
            developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                return <ProfileItem key={profile._id} profile={profile} />;
              })
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Profiles;
