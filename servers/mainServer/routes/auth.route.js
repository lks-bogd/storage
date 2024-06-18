const { Router } = require('express');

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../midllewaree/auth.middleware');
const { registrationValidator, loginValidator } = require('../validations/user');

const router = Router();

router.post('/registration', registrationValidator, controller.registration);
router.post('/login', loginValidator, controller.login);
router.get('/check', authMiddleware, controller.auth);

module.exports = router;