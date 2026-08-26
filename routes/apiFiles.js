'use strict';
const express = require('express');
const router = express.Router();
const ApiFileController = require('../controllers/ApiFileController');
const fileApiMiddleware = require('../middlewares/fileApi');

router.use(fileApiMiddleware);

router.get('/', ApiFileController.getAllFiles);


router.post('/', ApiFileController.createFile);

module.exports = router;