'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email : {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate : (value) => {
        return value.trim().length > 2;
      }
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate : (value) => {
        return value.trim().length > 2;
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
  });

  return User;
};
