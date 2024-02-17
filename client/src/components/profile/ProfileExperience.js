import React from 'react';
import Moment from 'react-moment';

const ProfileExperience = (props) => {
  const {
    experience: { company, title, to, from, description },
  } = props;
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        {' '}
        <Moment format='DD/MM/YYYY'>{from}</Moment> -{' '}
        {!to ? 'Now' : <Moment format='DD/MM/YYYY'>{to}</Moment>}
      </p>

      <p>
        <strong>Position: </strong> {title}
      </p>

      {description && (
        <p>
          <strong>Description: </strong> {description}
        </p>
      )}
    </div>
  );
};

export default ProfileExperience;
