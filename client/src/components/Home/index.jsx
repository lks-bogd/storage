import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getFiles } from '../../actions/file';

import FileList from './FileList';

import './index.css';
import Navbar from '../Navbar';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFiles());
  }, []);
  return (
    <div className='home'>
      <Navbar />
      <FileList />
    </div>
  )
}

export default Home
