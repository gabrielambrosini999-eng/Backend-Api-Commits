'use strict';
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Canal GET: Obtener todos los archivos
router.get('/', fileController.getAllFiles);

// Canal POST: Crear un nuevo archivo
router.post('/', fileController.createFile);

module.exports = router;