const { Router } = require('express');

const authRouter = require('./auth.route');
const fileRouter = require('./file.route');

const router = Router();

router.use('/auth', authRouter);
router.use('/file', fileRouter);

module.exports = router;