import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';

import Home from './Home';
import Login from './Auth/Login';
import Registration from './Auth/Registration';
import Notification from './Notification';

import { auth } from '../actions/user';

import './App.css';

function App() {
  const isAuth = useSelector(state => state.user.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(auth());
    }
  }, []);

  return (
    <BrowserRouter>
      <Notification />
      <Routes>
      {!isAuth ?
        <>
          <Route path='/registration' Component={Registration} exact/>
          <Route path='/login' Component={Login} exact/>
          <Route path='*' element={<Navigate to='/login'/>}/>
        </>
        :
        <>
          <Route path='/home' Component={Home} exact/>
          <Route path='*' element={<Navigate to='/home'/>}/>
        </>
      }
      </Routes>
    </BrowserRouter>
  )
}

export default App
