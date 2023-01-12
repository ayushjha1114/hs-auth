'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ticket.init({
    ticket_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Open'
    },
    status_color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'green'
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serial_number: {
      type: DataTypes.STRING,
    },
    model_number: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
    engineer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent_service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_provided: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'LOW'
    },
    image: {
      type: DataTypes.STRING,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'ticket',
  });
  return ticket;
};