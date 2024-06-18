import React from 'react'
import { useDispatch } from 'react-redux'; 

import { deleteFile, donwloadFile } from '../../../../actions/file';

import './index.css';

const File = (props) => {
  const dispatch = useDispatch();

  const fileDownloadHandler = (e) => {
    e.stopPropagation();
    dispatch(donwloadFile(props.file));
  }

  const fileDeleteHandler = (e) => {
    e.stopPropagation();
    dispatch(deleteFile(props.file));
  }

  return (
    <div className='file'>
      <div className='file__id'>{props.file.id}</div>
      <div className='file__name'>{props.file.name}</div>
      <div className='file__size'>{props.file.size}</div>
      <button 
        className='file__download-btn'
        onClick={(e) => fileDownloadHandler(e)}
      >
        Скачать
      </button>
      <button 
        className='file__delete-btn'
        onClick={(e) => fileDeleteHandler(e)}
      >
        Удалить
      </button>
    </div>
  )
}

export default File
