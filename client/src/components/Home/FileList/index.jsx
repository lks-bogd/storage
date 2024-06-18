import React from 'react'
import { useSelector } from 'react-redux'

import File from './File';

import './index.css';

const FileList = () => {
  const files = useSelector(state => state.file.files)
    .map((file, index )=> <File key={index} file={file}/>);

  return (
    <>
      <div className='filelist'>
        <div className="filelist__container">
          <div className="filelist__header">
            <div className='filelist__id'>ID</div>
            <div className='filelist__name'>Название</div>
            <div className='filelist__size'>Размер</div>
          </div>
          {files}
        </div>
      </div>
    </>
  )
}

export default FileList
