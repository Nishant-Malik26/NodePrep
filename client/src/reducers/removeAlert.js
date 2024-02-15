import { setAlert, removeAlert } from './alert';

export const setAlertWithRemove = (alert) => (dispatch) => {
  dispatch(setAlert(alert));
  setTimeout(() => {
    dispatch(removeAlert({ id: alert.id }));
  }, 5000);
};
