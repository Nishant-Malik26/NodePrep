import { combineReducers } from 'redux';
import alert from './alert';
import Auth from './register';
import Profile from './profile';
import Post from './post';

export default combineReducers({ alert, Auth, Profile, Post });
