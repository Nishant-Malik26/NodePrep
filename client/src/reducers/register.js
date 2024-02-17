import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import setAuthToken from '../setAuthToken';
import { setAlertWithRemove } from './removeAlert';
import { clearProfile } from './profile';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
};

const Auth = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    },
    loginSuccess: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    },
    registerFail: (state, action) => {
      localStorage.clear();
      return { ...state, token: null, isAuthenticated: false, loading: false };
    },
    loginFail: (state, action) => {
      localStorage.clear();
      return { ...state, token: null, isAuthenticated: false, loading: false };
    },
    userLoaded: (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    },
    authError: (state, action) => {
      localStorage.clear();
      return { ...state, token: null, isAuthenticated: false, loading: false };
    },
  },
});

export default Auth.reducer;

export const {
  registerSuccess,
  registerFail,
  userLoaded,
  authError,
  loginSuccess,
  loginFail,
} = Auth.actions;

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('api/users', body, config);
      dispatch(registerSuccess(res.data));
      dispatch(loadUser());
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((element) => {
          dispatch(
            setAlertWithRemove({ msg: element.msg, alertType: 'danger' })
          );
        });
      }

      dispatch(registerFail());
    }
  };

export const loadUser = () => async (dispatch) => {
  if (localStorage.getItem('token')) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch(userLoaded(res.data));
  } catch (error) {
    dispatch(authError());
  }
};

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post('api/auth', body, config);
      dispatch(loginSuccess(res.data));
      dispatch(loadUser());
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((element) => {
          dispatch(
            setAlertWithRemove({ msg: element.msg, alertType: 'danger' })
          );
        });
      }

      dispatch(loginFail());
    }
  };

export const logout = () => (dispatch) => {
  dispatch(clearProfile());
  dispatch(loginFail());
};
