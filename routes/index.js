var express = require('express');
var router = express.Router();
var homeController = require('../controllers/HomeController');
var fileController = require('../controllers/FileController');
var { validateFileEdit } = require('../middlewares/file');
var { handleValidation } = require('../middlewares/shared');

/* GET home page. */
router.get('/', homeController.index);

router.get('/file-edit', fileController.edit);

router.post(
    '/file-edit',
    validateFileEdit(),
    handleValidation,
    fileController.update
);

module.exports = router;
