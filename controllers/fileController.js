'use strict';
const { File } = require('../models');

const fileController = {
  // Crear un nuevo archivo
  createFile: async (req, res) => {
    try {
      const { name, content, branchId } = req.body;
      
      const newFile = await File.create({
        name,
        content,
        branchId
      });

      return res.status(201).json({
        message: 'Archivo creado exitosamente',
        data: newFile
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Error al crear el archivo',
        error: error.message
      });
    }
  },

  // Obtener todos los archivos
  getAllFiles: async (req, res) => {
    try {
      const files = await File.findAll();
      return res.status(200).json({ data: files });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener los archivos',
        error: error.message
      });
    }
  }
};

module.exports = fileController;