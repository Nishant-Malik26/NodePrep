import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import { useEffect } from 'react';
import { loadUser } from './reducers/register';
import setAuthToken from './setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import { PrivateRoutes } from './components/routing/PrivateRoutes';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if (localStorage.getItem('token')) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Landing />} />
          </Routes>
          <section className='container'>
            <Alert />
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />

              <Route element={<PrivateRoutes />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/create-profile' element={<CreateProfile />} />
                <Route path='/edit-profile' element={<EditProfile />} />
                <Route path='/add-experience' element={<AddExperience />} />
                <Route path='/add-education' element={<AddEducation />} />
                <Route path='/posts' element={<Posts />} />
                <Route path='/posts/:id' element={<Post />} />
              </Route>
              <Route path='/profiles' element={<Profiles />} />
              <Route path='/profile/:id' element={<Profile />} />
            </Routes>
          </section>
        </Router>
      </Provider>
    </>
  );
}

export default App;
