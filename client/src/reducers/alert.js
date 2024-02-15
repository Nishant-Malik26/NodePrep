import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const alert = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      return [...state, action.payload];
    },
    removeAlert: (state, action) => {
      return state.filter((el) => el.id !== action.payload.id);
    },
  },
});

export default alert.reducer;

export const { setAlert, removeAlert } = alert.actions;
