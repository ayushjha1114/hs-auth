'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class amc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      amc.belongsTo(models.user_profile, { foreignKey: 'user_profile_id'});
      models.user_profile.hasOne(amc, { foreignKey: 'user_profile_id'});
    }
  }
  amc.init({
    plan_activation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    plan_expired_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_plan: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    device: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    remaining_services: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    served_place: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_profile_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'amc',
  });
  return amc;
};