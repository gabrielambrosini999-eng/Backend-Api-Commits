var express = require('express');
var router = express.Router();
var fileController = require('../controllers/FileController');
var { validateFileEdit } = require('../middlewares/file');
var { handleValidation } = require('../middlewares/shared');
const config = require('../config/filesystem')
const multer = require('multer')
const upload = multer(config.code);

// Editar "un" archivo. Cómo le indico CUAL archivo ?
// /file/6334265/edit
router.get('/files/:id/edit', fileController.edit);

router.get('/files/upload', fileController.create);

router.post('/files', upload.array('file', 100), fileController.store);

router.patch(
    '/files/:id/edit',
    validateFileEdit(),
    handleValidation,
    fileController.update
);

router.delete('/files/:id', fileController.destroy);

module.exports = router;
