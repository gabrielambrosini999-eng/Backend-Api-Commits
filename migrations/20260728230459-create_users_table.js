'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (q, Sequelize) {
    await q.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE, // TIMESTAMP
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE, // TIMESTAMP
        allowNull: true,
      },
    });
  },

  async down (q, Sequelize) {
    await q.dropTable('users');
  }
};
