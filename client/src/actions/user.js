import axios from 'axios';
import { setUser } from '../reducers/user';
import { setNotification } from '../reducers/notification';

export const registration = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/auth/registration`, {
        email,
        password
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem('token', response.data.token);
      dispatch(setNotification(response.data.message));
    } catch (e) {
      if (e.response) {
        dispatch(setNotification(e.response.data.message));
      } else {
        dispatch(setNotification(e));
      }
      console.log(e);
    }
  }
}

export const login = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/auth/login`, {
        email,
        password
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem('token', response.data.token);
    } catch (e) {
      if (e.response) {
        dispatch(setNotification(e.response.data.message));
      } else {
        dispatch(setNotification(e));
      }
      console.log(e);
    }
  }
}

export const auth = () => {
  return async dispatch => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/auth/check`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem('token', response.data.token);
    } catch (e) {
      if (e.response) {
        dispatch(setNotification(e.response.data.message));
      } else {
        dispatch(setNotification(e));
      }
      console.log(e);
    }
  }
}