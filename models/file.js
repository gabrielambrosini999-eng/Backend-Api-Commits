'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
    }
  }

  File.init({
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notNull: { msg: 'El nombre es obligatorio' },
        notEmpty: { msg: 'El nombre no puede estar vacío' },
        len: { args: [1, 150], msg: 'El nombre no debe superar 150 caracteres' }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'branch_id',
      validate: {
        isInt: { msg: 'branchId debe ser numérico' }
      }
    }
  }, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    underscored: true
  });

  return File;
};