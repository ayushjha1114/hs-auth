'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'user_profiles', // table name
      'director_email', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    await queryInterface.addColumn(
      'user_profiles',
      'admin_email',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    await queryInterface.addColumn(
      'user_profiles',
      'contact_person_name',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    await queryInterface.addColumn(
      'user_profiles',
      'contact_person_number',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    await queryInterface.addColumn(
      'user_profiles',
      'user_id',
      {
        type: Sequelize.STRING, 
        allowNull: false,
      },
    ),
    await queryInterface.addColumn(
      'tickets',
      'customer_plan',
      {
        type: Sequelize.STRING, 
        allowNull: true,
      },
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_profiles', 'director_email'),
    await queryInterface.removeColumn('user_profiles', 'admin_email'),
    await queryInterface.removeColumn('user_profiles', 'contact_person_name'),
    await queryInterface.removeColumn('user_profiles', 'contact_person_number'),
    await queryInterface.removeColumn('user_profiles', 'user_id'),
    await queryInterface.removeColumn('tickets', 'customer_plan')
  }
};
