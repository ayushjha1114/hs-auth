'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'amcs', // table name
      'director_email', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    await queryInterface.addColumn(
      'amcs',
      'admin_email',
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
    // queryInterface.changeColumn(
    //   'tickets', 
    //   'address', 
    //   {
    //     type: Sequelize.JSON,
    //     allowNull: false
    //   }
    // )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('amcs', 'director_email'),
    await queryInterface.removeColumn('amcs', 'admin_email'),
    await queryInterface.removeColumn('user_profiles', 'user_id'),
    await queryInterface.removeColumn('tickets', 'customer_plan')
    // await queryInterface.changeColumn('tickets', 'address')
  }
};
