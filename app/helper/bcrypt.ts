
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
import url from '../config/environments/dev';
const path = require('path');
const fs = require('fs');
const helper = {
  generateSaltValue(password) {
    const salt = bcrypt.genSaltSync(); // enter number of rounds, default: 10
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  comparePassword(userPassword, password ) {
    console.log("🚀 ~ file: bcrypt.ts:14 ~ comparePassword ~ userPassword, password", userPassword, password)
    if (!userPassword.length ||  !( password && password.length > 0) ) {
      return false;
    }
    return bcrypt.compareSync(userPassword, password);
  },
	
  buildUserToken(data) {
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      mobile: data.mobile,
      email: data.email
    }
  },
  resource( path ) {
		return `${url.API}${path}`;
	},
	randomString() {
		return Math.random().toString(36).substring(2, 7);
  },
};

export default helper;


