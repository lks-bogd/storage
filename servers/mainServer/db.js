const { Sequelize } = require('sequelize');

const { config } = require('dotenv');
config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Название базы данных
  process.env.DB_USER, // Имя пользователя
  process.env.DB_PASSWORD, // Пароль
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);

module.exports = sequelize;