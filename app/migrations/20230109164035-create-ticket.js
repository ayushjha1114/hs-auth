'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Open'
      },
      status_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'green'
      },
      customer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      serial_number: {
        type: Sequelize.STRING,
      },
      model_number: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      remark: {
        type: Sequelize.STRING,
      },
      engineer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.JSON,
        allowNull: false
      },
      parent_service: {
        type: Sequelize.STRING,
        allowNull: false
      },
      service_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      service_provided: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      priority: {
        type: Sequelize.STRING,
        defaultValue: 'LOW'
      },
      image: {
        type: Sequelize.STRING,
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tickets');
  }
};