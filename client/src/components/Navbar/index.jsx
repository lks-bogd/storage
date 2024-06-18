import React from 'react'
import { useDispatch } from 'react-redux';

import { logout } from '../../reducers/user';
import { uploadFile } from '../../actions/file';

import './index.css';
import { setFiles } from '../../reducers/file';

const Navbar = () => {
  const dispatch = useDispatch();

  const fileUploadHandler = (e) => {
    const files = [...e.target.files];
    files.forEach(file => dispatch(uploadFile(file)));
  }

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(setFiles([]));
  }

  return (
    <nav className='navbar'>
      <div className="navbar__container">
        <h2 className="navbar__title"> MyFiles </h2>
        <ul className="navbar__list">
          <li className="navbar__item">
            <label htmlFor='upload_file' className='navbar__label'>Загрузить файл</label>
            <input className='navbar__input'
              type='file'
              id='upload_file'
              multiple={true}
              onChange={(e) => fileUploadHandler(e)}
            />
            </li>
          <li className="navbar__item">
            <button 
              className="navbar__logout" 
              onClick={() => logoutHandler()}
            >
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
