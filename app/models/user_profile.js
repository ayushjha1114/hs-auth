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
      console.log("🚀 ~ file: user_profile.js:13 ~ user_profile ~ associate ~ models", models)
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
    company_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    date_of_registration: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    gst_number: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    pan_number: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    director_email: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    admin_email: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    contact_person_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    contact_person_number: {
      type: DataTypes.STRING(20),
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
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'user_profile',
  });
  return user_profile;
};