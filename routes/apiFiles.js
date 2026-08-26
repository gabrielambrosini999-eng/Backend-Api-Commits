'use strict';
const express = require('express');
const router = express.Router();
const ApiFileController = require('../controllers/ApiFileController');
const fileApiMiddleware = require('../middlewares/fileApi');

// Middleware de protección para todas las rutas de la API de archivos
router.use(fileApiMiddleware);

// 1. GET /api/branches/:branchId/files -> Obtener todos los archivos de una rama
router.get('/branches/:branchId/files', ApiFileController.getAllFiles);

// 2. GET /api/files/:id -> Obtener un archivo específico por ID
router.get('/files/:id', ApiFileController.getFileById);

// 3. POST /api/branches/:branchId/files -> Crear un archivo en una rama
router.post('/branches/:branchId/files', ApiFileController.createFile);

// 4. PUT /api/files/:id -> Actualizar un archivo por ID
router.put('/files/:id', ApiFileController.updateFile);

// 5. DELETE /api/files/:id -> Eliminar un archivo por ID
router.delete('/files/:id', ApiFileController.deleteFile);

module.exports = router;