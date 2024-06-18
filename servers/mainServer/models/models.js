const { DataTypes } = require('sequelize');

const sequelize = require('../db');

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false}
});

const Storage = sequelize.define('storage', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  space: {type: DataTypes.BIGINT, defaultValue: 1024**3*10},
  usedSpace: {type: DataTypes.BIGINT, defaultValue: 0}
});

const File = sequelize.define('file', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  type: {type: DataTypes.STRING, allowNull: false},
  size: {type: DataTypes.INTEGER, allowNull: false}
});

User.hasOne(Storage);
Storage.belongsTo(User);

Storage.hasMany(File);
File.belongsTo(Storage);

module.exports = {
  User,
  Storage,
  File
}