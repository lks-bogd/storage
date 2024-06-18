const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const upload = require('./multer');

app.post('/file', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: 'Нечего загружать'
    });
  }
  const partPath = path.join('uploads', file.originalname);
  fs.renameSync(file.path, partPath);
  res.json({
    message: 'Часть загружена'
  });
});

app.delete('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
  if (fs.existsSync(filePath)) {
    console.log(`Удаление с ${PORT}`);
    fs.unlinkSync(filePath);
    res.json({
      message: 'Успешно удалено'
    });
  } else {
    res.status(400).json({
      message: 'Часть не найдена'
    });
  }
});

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);

  if (fs.existsSync(filePath)) {
    console.log(`Заргрузка с ${PORT}`);
    res.download(filePath);
  } else {
    res.status(400).json({
      message: 'Часть не найдена'
    });
  }
});

app.get('/health-check' , (req, res) => {
  res.status(200).send('OK');
});

start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();