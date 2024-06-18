const { Router } = require('express');

const controller = require('../controllers/file.controller');
const authMiddleware = require('../midllewaree/auth.middleware');
const upload = require('../multer');

const router = Router();

router.get('/download', authMiddleware, controller.download);
router.post('/upload', authMiddleware, upload.single('file'), controller.upload);
router.delete('/', authMiddleware, controller.delete);
router.get('/', authMiddleware, controller.getFiles);

module.exports = router;