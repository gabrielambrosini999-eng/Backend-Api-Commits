'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('files', [
      {
        name: 'esquema.pdf',
        content: 'ramas en repo',
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'detalle.txt',
        content: 'descripcion de cada una de las ramas',
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('files', null, {});
  }
};