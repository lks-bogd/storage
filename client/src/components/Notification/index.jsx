import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { hideNotification } from '../../reducers/notification';

import './index.css';

const Notification = () => {
  const { message, visible } = useSelector(state => state.notification);
  const dispatch = useDispatch();

  const hideMessageHandler = () => {
    dispatch(hideNotification());
  }

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        dispatch(hideNotification());
      }, 30000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="container">
      <div  className='notification'>
        <div className='notification__text'>
          {message}
        </div>
        <button
            className='notification__btn'
            onClick={() => hideMessageHandler()}
          >
            Скрыть
        </button>
      </div>
    </div>
  );
};

export default Notification;