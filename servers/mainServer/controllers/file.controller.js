const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const { File, Storage } = require('../models/models');

const { config } = require('dotenv');
config();

const servers = [
  process.env.SERVER_1_URL,
  process.env.SERVER_2_URL,
  process.env.SERVER_3_URL,
]
class FileController {
  upload = async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: 'Нет файла для загрузки'
      });
    }
    
    let filePath = file.path;

    const dbFile = await File.findOne({ where: {name: file.originalname}});
    if (dbFile) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'Файл с таким именем уже существует'
      });
    }
    const storage = await Storage.findOne({where: {userId: req.user.id}});
    if (Number(storage.usedSpace) + file.size > Number(storage.space)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'Недостаточно места на диске'
      });
    }

    for (let i = 0; i < servers.length; i++) {
      const serverURL = `${servers[i]}/health-check`;
      try {
        await axios.get(serverURL);
      } catch (e) {
        fs.unlinkSync(filePath);
        return res.status(503).json({
          message: `Сервер недоступен, невозможно загрузить файл`
        });
      }
    }

    const fileSize = fs.statSync(filePath).size;
    const chunkSize = Math.ceil(fileSize / servers.length);
    let fileStream;
    try {
      fileStream = fs.createReadStream(filePath, {
        highWaterMark: chunkSize
      });
    } catch (e) {
      return res.status(500).json({
        message: 'Ошибка при чтении файла'
      });
    }
    
    let partNumber = 0;
    fileStream.on('data', async (chunk) => {
      const storage = await Storage.findOne({where: { userId: req.user.id } });
      partNumber++;
      const partPath = path.join('uploads', `${storage.id}_${file.filename}.part${partNumber}`);
      fs.writeFileSync(partPath, chunk);
      const serverURL = `${servers[partNumber - 1]}/file`;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(partPath));
      try {
        await axios.post(serverURL, formData, {
          headers: formData.getHeaders(),
        });
        console.log(`Часть загружена на сервер: ${serverURL}`);
      } catch (e) {
        console.log(`Произошла ошибка при отправке части на сервер: ${serverURL}`, e);
        return res.status(500).json({
          message: 'Не удалось отправить файл на сервер'
        })
      }
      fs.unlinkSync(partPath);
    });

    fileStream.on('end', async () => {
      fs.unlinkSync(filePath);
      const storage = await Storage.findOne({where: { userId: req.user.id } });
      const dbFile = await File.create({ name: file.originalname, type: file.mimetype, size: file.size, storageId: storage.id});
      const usedSpace = Number(storage.usedSpace) + file.size;
      await Storage.update({usedSpace: usedSpace}, {where: {id: storage.id}});
      res.json({
        message: 'Файл загружен на сервер и поделен на части',
        file: dbFile
      });
    });

    fileStream.on('error', (error) => {
      console.log(error);
      return res.status(500).json({
        message: 'Произошла ошибка на сервере'
      });
    });
  }

  download = async (req, res) => {
    try {
      const fileId = req.query.id;
      const dbFile = await File.findOne({where: {id: fileId}});
      const storage = await Storage.findOne({where: {userId: req.user.id}})
      const filePath = path.join('downloads', dbFile.name);

      for (let i = 0; i < servers.length; i++) {
        const serverURL = `${servers[i]}/health-check`;
        try {
          await axios.get(serverURL);
        } catch (e) {
          return res.status(503).json({
            message: `Сервер недоступен, невозможно скачать файл`
          });
        }
      }
      const fileStream = fs.createWriteStream(filePath);
      const downloadPromises = servers.map(async (server, i) => {
        const serverURL = `${server}/file/${storage.id}_${dbFile.name}.part${i + 1}`;
        const response = await axios.get(serverURL, { responseType: 'stream' });
        return new Promise((resolve, reject) => {
          response.data.pipe(fileStream, { end: false });
          response.data.on('end', resolve).on('error', reject);
        });
      });
  
      await Promise.all(downloadPromises);
      fileStream.end();

      res.download(filePath, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Произошла ошибка при попытке скачать файл' });
        }
        fs.unlinkSync(filePath);
        console.log('Файл успешно скачан');
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: `Произошла ошибка при скачивании файла`
      });
    }
  }

  getFiles = async (req, res) => {
    try {
      const storage = await Storage.findOne({where: {userId: req.user.id}});
      const files = await File.findAll({where: {storageId: storage.id}});

      res.json({
        message: 'Все ок',
        files
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: `Не удалось получить файлы`
      });
    }
  }

  delete = async (req, res) => {
    try {
      const fileId = req.query.id;
      const dbFile = await File.findOne({where: {id: fileId}});
      const storage = await Storage.findOne({where: {userId: req.user.id}});

      for (let i = 0; i < servers.length; i++) {
        const serverURL = `${servers[i]}/health-check`;
        try {
          await axios.get(serverURL);
        } catch (e) {
          return res.status(503).json({
            message: `Сервер недоступен, невозможно удалить файл`
          });
        }
      }
      for (let i = 0; i < servers.length; i++) {
        await axios.delete(`${servers[i]}/file/${storage.id}_${dbFile.name}.part${i + 1}`);
      }
      const usedSpace = Number(storage.usedSpace) - Number(dbFile.size);
      await Storage.update({usedSpace: usedSpace}, {where: {id: storage.id}});
      await File.destroy({where: {id: dbFile.id}});
      res.json({
        message: 'Файл успешно удален'
      });
    } catch (e) {
      res.status(500).json({
        message: 'Не удалось удалить файл'
      });
      console.log(e);
    }
  }
}

module.exports = new FileController;