'use strict';

const { faker } = require('@faker-js/faker');
const { hashSync } = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (q, Sequelize) {
    const users = []
    const password = hashSync('secret', 10);

    for (let i = 0; i < 1000; i++) {
      users.push({
        email: faker.internet.email(),
        password,
        created_at: '2026-07-28 20:29:33',
        updated_at: '2026-07-28 20:29:33',
      })
    }

     await q.bulkInsert('users', users, {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('users', null, {});
  }
};
