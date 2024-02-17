import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlertWithRemove } from './removeAlert';

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  repos: null,
  error: {},
};

const Profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfileSuccess: (state, action) => {
      return { ...state, profile: action.payload, loading: false };
    },
    getProfileFail: (state, action) => {
      return { ...state, error: action.payload, loading: false };
    },
    clearProfile: (state, action) => {
      return { ...state, profile: null, repos: [], loading: false };
    },
    createProfileSuccess: (state, action) => {
      return { ...state, profile: action.payload, loading: false };
    },
    getAllProfilesSuccess: (state, action) => {
      return { ...state, profiles: action.payload, loading: false };
    },
    getGithubReposSuccess: (state, action) => {
      return { ...state, repos: action.payload, loading: false };
    },
  },
});

export default Profile.reducer;
export const {
  getProfileSuccess,
  getProfileFail,
  clearProfile,
  createProfileSuccess,
  getAllProfilesSuccess,
  getGithubReposSuccess,
} = Profile.actions;

export const getProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch(getProfileSuccess(res.data.profile));
  } catch (error) {
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const getAllProfiles = () => async (dispatch) => {
  try {
    dispatch(clearProfile());
    const res = await axios.get('/api/profile');
    console.log('🚀 ~ getAllProfiles ~ res:', res);
    dispatch(getAllProfilesSuccess(res.data));
  } catch (error) {
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const getProfileById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${id}`);
    console.log('🚀 ~ getAllProfiles ~ res:', res);
    dispatch(getProfileSuccess(res.data));
  } catch (error) {
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    console.log('🚀 ~ getAllProfiles ~ res:', res);
    dispatch(getGithubReposSuccess(res.data));
  } catch (error) {
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/profile', formData, config);
      dispatch(createProfileSuccess(res.data));
      dispatch(
        setAlertWithRemove(
          edit
            ? 'Profile Updated Successfully'
            : 'Profile Created Successfully',
          'success'
        )
      );
      if (!edit) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((element) => {
          dispatch(
            setAlertWithRemove({ msg: element.msg, alertType: 'danger' })
          );
        });
      }
      dispatch(
        getProfileFail({
          msg: error?.response?.statusText,
          status: error?.response?.status,
        })
      );
    }
  };
export const addExperience = (formData, navigate) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put('/api/profile/experience', formData, config);
    dispatch(getProfileSuccess(res.data));
    dispatch(setAlertWithRemove('Experience Added Successfully'), 'success');
    navigate('/dashboard', { replace: true });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => {
        dispatch(setAlertWithRemove({ msg: element.msg, alertType: 'danger' }));
      });
    }
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const deleteExperience = (id) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.delete(`/api/profile/experience/${id}`, config);
    dispatch(getProfileSuccess(res.data));
    dispatch(setAlertWithRemove('Experience Deleted Successfully', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => {
        dispatch(setAlertWithRemove({ msg: element.msg, alertType: 'danger' }));
      });
    }
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
export const addEducation = (formData, navigate) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put('/api/profile/education', formData, config);
    dispatch(getProfileSuccess(res.data));
    dispatch(setAlertWithRemove('Education Added Successfully'));
    navigate('/dashboard', { replace: true });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => {
        dispatch(setAlertWithRemove({ msg: element.msg, alertType: 'danger' }));
      });
    }
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.delete(`/api/profile/education/${id}`, config);
    dispatch(getProfileSuccess(res.data));
    dispatch(setAlertWithRemove('Education Deleted Successfully', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => {
        dispatch(setAlertWithRemove({ msg: element.msg, alertType: 'danger' }));
      });
    }
    dispatch(
      getProfileFail({
        msg: error?.response?.statusText,
        status: error?.response?.status,
      })
    );
  }
};
