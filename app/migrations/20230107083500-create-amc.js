'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('amcs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      date_of_registration: {
        type: Sequelize.DATE,
        allowNull: false
      },
      plan_activation_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      plan_expired_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      user_plan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      device: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      remaining_services: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      served_place: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pan_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      user_profile_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('amcs');
  }
};