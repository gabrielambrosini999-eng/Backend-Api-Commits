'use strict'; 

/** @type { import('sequelize').Migration } */
module.exports = {
    async up(q, Sequelize) {
        await q.createTable('commits', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            repository_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            branch_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(q, Sequelize) {
        await q.dropTable('commits');
    }
};