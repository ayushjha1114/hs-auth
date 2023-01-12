'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      payment_detail.belongsTo(models.ticket, { foreignKey: 'ticket_id'});
      models.ticket.hasOne(payment_detail, { foreignKey: 'ticket_id'});
    }
  }
  payment_detail.init({
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoice_amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoice_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'payment_detail',
  });
  return payment_detail;
};