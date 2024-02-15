import React from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alertState = useSelector((state) => state.alert);
  return (
    alertState !== null &&
    alertState?.length > 0 &&
    alertState?.map((alert) => {
      return (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      );
    })
  );
};

export default Alert;
