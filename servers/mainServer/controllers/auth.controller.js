const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const { User, Storage } = require('../models/models');

const generateAccessToken = (id, email) => {
  const payload = {
    id,
    email
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '6h' });
  return token;
}

class AuthController {
  registration = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({where: { email } });
      if (candidate) {
        return res.status(400).json({
          message: 'Пользователь с таким email уже существует'
        });
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({ email, password: hashPassword});
      const storage = await Storage.create({ userId: user.id});
      const token = generateAccessToken(user.id, user.email);
      res.json({
        message: 'Регистрация прошла успешно',
        token,
        user: {
          id: user.id,
          email: user.email
        },
        storage: {
          id: storage.id,
          space: storage.space
        }
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        message: 'Произошла ошибка при регистрации'
      });
    }
  }

  login = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          message: 'Неверно введен email'
        });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          message: 'Неверно введен пароль'
        });
      }

      const token = generateAccessToken(user.id, user.email);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        message: 'Произошлка ошибка при попытке войти'
      });
    }
  }

  auth = async (req, res) => {
    try {
      const user = await User.findOne({where: {id: req.user.id}});
      const token = generateAccessToken(user.id, user.email);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        message: 'Не удалось авторизоваться'
      });
    }
  }
}

module.exports = new AuthController();