'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middle_name: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      last_name: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_of_birth: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      gender: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      img_url: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'ENGINEER', 'AMC', 'USER'),
        allowNull: false
      },
      aadhaar_number: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      current_address: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      current_state: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      current_city: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      current_pincode: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      permanent_address: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      permanent_state: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      permanent_city: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      permanent_pincode: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profiles');
  }
};