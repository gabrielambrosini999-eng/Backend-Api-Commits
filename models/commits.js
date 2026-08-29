'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Commit extends Model {
        static associate(models) {
            if (models.User){
                Commit.belongsTo(models.User, {
                    foreignKey: 'user_id' });
            }
        }
    }

    Commit.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        message: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },

        repository_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Commit',
        tableName: 'commits',
        timestamps: true,
        underscored: true,
    });

    return Commit;
};