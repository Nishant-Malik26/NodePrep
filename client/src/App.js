import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';

function App() {
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
            </Routes>
          </section>
        </Router>
      </Provider>
    </>
  );
}

export default App;
