'use strict';
const { File } = require('../models');

const fileController = {
  // 1. GET /api/branches/:branchId/files
  getAllFiles: async (req, res) => {
    try {
      const { branchId } = req.params;
      if (isNaN(branchId)) {
        return res.status(400).json({ message: 'El branchId debe ser numérico' });
      }

      const files = await File.findAll({ where: { branch_id: branchId } });
      return res.status(200).json({ data: files });
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener los archivos', error: error.message });
    }
  },

  // 2. GET /api/files/:id
  getFileById: async (req, res) => {
    try {
      const { id } = req.params;
      const file = await File.findByPk(id);

      if (!file) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }
      return res.status(200).json({ data: file });
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el archivo', error: error.message });
    }
  },

  // 3. POST /api/branches/:branchId/files
  createFile: async (req, res) => {
    try {
      const { branchId } = req.params;
      const { name, content } = req.body;

      // Validaciones 
      if (isNaN(branchId)) {
        return res.status(400).json({ message: 'El branchId debe ser numérico' });
      }
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'El campo name es obligatorio y no puede estar vacío' });
      }
      if (name.length > 150) {
        return res.status(400).json({ message: 'El campo name no debe superar los 150 caracteres' });
      }

      const newFile = await File.create({
        name: name.trim(),
        content,
        branch_id: branchId
      });

      return res.status(201).json({ message: 'Archivo creado exitosamente', data: newFile });
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear el archivo', error: error.message });
    }
  },

  // 4. PUT /api/files/:id
  updateFile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, content } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'El campo name es obligatorio y no puede estar vacío' });
      }
      if (name.length > 150) {
        return res.status(400).json({ message: 'El campo name no debe superar los 150 caracteres' });
      }

      const file = await File.findByPk(id);
      if (!file) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }

      await file.update({ name: name.trim(), content });
      return res.status(200).json({ message: 'Archivo actualizado exitosamente', data: file });
    } catch (error) {
      return res.status(400).json({ message: 'Error al actualizar el archivo', error: error.message });
    }
  },

  // 5. DELETE /api/files/:id
  deleteFile: async (req, res) => {
    try {
      const { id } = req.params;
      const file = await File.findByPk(id);

      if (!file) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }

      await file.destroy();
      return res.status(200).json({ message: 'Archivo eliminado exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el archivo', error: error.message });
    }
  }
};

module.exports = fileController;