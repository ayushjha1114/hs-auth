'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('amcs', {
      fields : ['user_profile_id'],
      type: 'foreign key',
      references: {
        table: 'user_profiles',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('amcs', {
      fields : ['user_profile_id'],
      type: 'foreign key',
      references: {
        table: 'user_profiles',
        field: 'id'
      }
    })
  }
};
