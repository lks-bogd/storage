import axios from 'axios';
import { addFile, setFiles, removeFile } from '../reducers/file';
import { setNotification } from '../reducers/notification';

export const getFiles = () => {
  return async dispatch => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/file/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      dispatch(setFiles(response.data.files));
    } catch (e) {
      dispatch(setNotification(e?.response?.data?.message));
      console.log(e);
    }
  }
}

export const uploadFile = (file) => {
  return async dispatch => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/file/upload`, 
        formData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(addFile(response.data.file));
      dispatch(setNotification(response.data.message));
    } catch (e) {
      dispatch(setNotification(e?.response?.data?.message));
      console.log(e);
    }
  }
}

export const donwloadFile = (file) => {
  return async dispatch => {
    try {
      await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/file/download?id=${file.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
        responseType: 'blob'
      }).then(res => {
        const downloadURL = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (e) {
      dispatch(setNotification(e?.response?.data?.message));
      console.log(e);
    }
  }
}

export const deleteFile = (file) => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/file?id=${file.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
      });
      dispatch(removeFile(file.id));
      dispatch(setNotification(response.data.message));
    } catch (e) {
      dispatch(setNotification(e?.response?.data?.message));
      console.log(e);
    }
  }
}