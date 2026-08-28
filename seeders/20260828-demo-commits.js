'use strict';

const { faker } = require('@faker-js/faker');

/** @type { import('sequelize-cli').Seeder } */
module.exports = {
    async up(q, Sequelize) {
        const commits = [];
        const now = '2026-08-26 12:00:00';

        for (let i = 0; i <= 30; i++) {
            commits.push({
                message: faker.git.commitMessage(),
                repository_id: faker.number.int({ min: 1, max: 5 }),
                branch_id: faker.number.int({ min: 1, max: 3 }),
                user_id: faker.number.int({ min: 1, max: 1000 }),
                created_at: now,
                updated_at: now,
            });
        }   

        await q.bulkInsert('commits', commits, {});
    },

    async down(q, Sequelize) {
        await q.bulkDelete('commits', null, {});
    }
};