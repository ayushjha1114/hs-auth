'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_profile.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    img_url: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'ENGINEER', 'AMC', 'USER'),
      allowNull: false
    },
    aadhaar_number: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    current_address: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    current_state: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    current_city: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    current_pincode: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    permanent_address: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    permanent_state: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    permanent_city: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    permanent_pincode: {
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
  }, {
    sequelize,
    modelName: 'user_profile',
  });
  return user_profile;
};