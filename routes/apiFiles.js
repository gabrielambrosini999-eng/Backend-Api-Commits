'use strict';
const express = require('express');
const router = express.Router();
const ApiFileController = require('../controllers/ApiFileController');

// Canal GET: Obtener todos los archivos
router.get('/', ApiFileController.getAllFiles);

// Canal POST: Crear un nuevo archivo
router.post('/', ApiFileController.createFile);

module.exports = router;