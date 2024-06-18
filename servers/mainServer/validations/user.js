const { body } = require('express-validator');

const registrationValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите email'),
  body('password')
    .exists()
    .withMessage('Пароль обязателен')
    .isLength({ min: 8})
    .withMessage('Длина пароля должна быть от 8 символов')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите email'),
  body('password')
    .exists()
    .withMessage('Пароль обязателен')
];

module.exports = {
  registrationValidator,
  loginValidator
}
