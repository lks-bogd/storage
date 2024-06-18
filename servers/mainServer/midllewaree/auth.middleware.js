const jwt = require('jsonwebtoken');

const { config } = require('dotenv');
config();

module.exports = function (req, res, next) {
  if (req.methof === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Вы не авторизованы'
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      message: 'Вы не авторизованы'
    });
  }
}